'use strict';

import React from 'react';
import invariant from './lib/invariant';
import NavigationContext from './context';

const PropTypes = React.PropTypes;

const SCENE_DISABLED_NATIVE_PROPS = '';
const styles = {
  baseScene: {},
  disabledSceneStyle: {},
  container: {},
};

let __uid = 0;
function getuid() {
  return __uid++;
}

function getRouteID(route) {
  if (route === null || typeof route !== 'object') {
    return String(route);
  }

  let key = '__navigatorRouteID';

  if (!route.hasOwnProperty(key)) {
    Object.defineProperty(route, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: getuid(),
    });
  }
  return route[key];
}

/**
 * Use `Navigator` to transition between different scenes in your app. To
 * accomplish this, provide route objects to the navigator to identify each
 * scene, and also a `renderScene` function that the navigator can use to
 * render the scene for a given route.
 *
 * To change the animation or gesture properties of the scene, provide a
 * `configureScene` prop to get the config object for a given route. See
 * `Navigator.SceneConfigs` for default animations and more info on
 * scene config options.
 *
 * ### Basic Usage
 *
 * ```
 *   <Navigator
 *     initialRoute={{name: 'My First Scene', index: 0}}
 *     renderScene={(route, navigator) =>
 *       <MySceneComponent
 *         name={route.name}
 *         onForward={() => {
 *           var nextIndex = route.index + 1;
 *           navigator.push({
 *             name: 'Scene ' + nextIndex,
 *             index: nextIndex,
 *           });
 *         }}
 *         onBack={() => {
 *           if (route.index > 0) {
 *             navigator.pop();
 *           }
 *         }}
 *       />
 *     }
 *   />
 * ```
 *
 * ### Navigator Methods
 *
 * If you have a ref to the Navigator element, you can invoke several methods
 * on it to trigger navigation:
 *
 *  - `getCurrentRoutes()` - returns the current list of routes
 *  - `jumpBack()` - Jump backward without unmounting the current scene
 *  - `jumpForward()` - Jump forward to the next scene in the route stack
 *  - `jumpTo(route)` - Transition to an existing scene without unmounting
 *  - `push(route)` - Navigate forward to a new scene, squashing any scenes
 *     that you could `jumpForward` to
 *  - `pop()` - Transition back and unmount the current scene
 *  - `replace(route)` - Replace the current scene with a new route
 *  - `replaceAtIndex(route, index)` - Replace a scene as specified by an index
 *  - `replacePrevious(route)` - Replace the previous scene
 *  - `immediatelyResetRouteStack(routeStack)` - Reset every scene with an
 *     array of routes
 *  - `popToRoute(route)` - Pop to a particular scene, as specified by it's
 *     route. All scenes after it will be unmounted
 *  - `popToTop()` - Pop to the first scene in the stack, unmounting every
 *     other scene
 *
 */
class Navigator extends React.Component {

  static propTypes = {
    /**
     * Optional function that allows configuration about scene animations and
     * gestures. Will be invoked with the route and should return a scene
     * configuration object
     *
     * ```
     * (route) => Navigator.SceneConfigs.FloatFromRight
     * ```
     */
    configureScene: PropTypes.func,

    /**
     * Required function which renders the scene for a given route. Will be
     * invoked with the route and the navigator object
     *
     * ```
     * (route, navigator) =>
     *   <MySceneComponent title={route.title} />
     * ```
     */
    renderScene: PropTypes.func.isRequired,

    /**
     * Specify a route to start on. A route is an object that the navigator
     * will use to identify each scene to render. `initialRoute` must be
     * a route in the `initialRouteStack` if both props are provided. The
     * `initialRoute` will default to the last item in the `initialRouteStack`.
     */
    initialRoute: PropTypes.object,

    /**
     * Provide a set of routes to initially mount. Required if no initialRoute
     * is provided. Otherwise, it will default to an array containing only the
     * `initialRoute`
     */
    initialRouteStack: PropTypes.arrayOf(PropTypes.object),

    /**
     * Optionally provide the navigator object from a parent Navigator
     */
    navigator: PropTypes.object,

    /**
     * Styles to apply to the container of each scene
     */
    //sceneStyle: View.propTypes.style,
  }

  constructor(props) {
    super(props);
    this._renderedSceneMap = new Map();

    let routeStack = this.props.initialRouteStack || [this.props.initialRoute];
    invariant(
      routeStack.length >= 1,
        'Navigator requires props.initialRoute or props.initialRouteStack.'
    );
    let initialRouteIndex = routeStack.length - 1;
    if (this.props.initialRoute) {
      initialRouteIndex = routeStack.indexOf(this.props.initialRoute);
      invariant(
        initialRouteIndex !== -1,
        'initialRoute is not in initialRouteStack.'
      );
    }

    this.state = {
      routeStack,
      presentedIndex: initialRouteIndex,
      transitionFromIndex: null,
      transitionQueue: [],
    };
  }

  get navigationContext() {
    if (!this._navigationContext) {
      this._navigationContext = new NavigationContext();
    }
    return this._navigationContext;
  }

  immediatelyResetRouteStack(nextRouteStack) {
    let destIndex = nextRouteStack.length - 1;
    this.setState({
      routeStack: nextRouteStack,
      presentedIndex: destIndex,
      transitionFromIndex: null,
    });
  }

  _emitDidFocus(route) {
    this.navigationContext.emit('didfocus', {route});
  }

  _emitWillFocus(route) {
    this.navigationContext.emit('willfocus', {route});
  }

  _getDestIndexWithinBounds(n) {
    let currentIndex = this.state.presentedIndex;
    let destIndex = currentIndex + n;
    invariant(
      destIndex >= 0,
        'Cannot jump before the first route.'
    );
    let maxIndex = this.state.routeStack.length - 1;
    invariant(
      maxIndex >= destIndex,
        'Cannot jump past the last route.'
    );
    return destIndex;
  }

  _jumpN(n) {
    let destIndex = this._getDestIndexWithinBounds(n);
    this._enableScene(destIndex);
    this._emitWillFocus(this.state.routeStack[destIndex]);
    this._transitionTo(destIndex);
  }

  /**
   * Hides all scenes that we are not currently on, gesturing to, or transitioning from
   */
  _hideScenes() {
    for (let i = 0; i < this.state.routeStack.length; i++) {
      if (i === this.state.presentedIndex ||
          i === this.state.transitionFromIndex) {
        continue;
      }
      this._disableScene(i);
    }
  }

  /**
   * Push a scene off the screen, so that opacity:0 scenes will not block touches sent to the presented scenes
   */
  _disableScene(sceneIndex) {
    if (this.refs['scene_' + sceneIndex]) {
      this.refs['scene_' + sceneIndex].getDOMNode().style = SCENE_DISABLED_NATIVE_PROPS;
    }
  }

  /**
   * Put the scene back into the state as defined by props.sceneStyle, so transitions can happen normally
   */
  _enableScene(sceneIndex) {
    // First, determine what the defined styles are for scenes in this navigator
    let sceneStyle = Object.assign({}, styles.baseScene, this.props.sceneStyle);
    // Then restore the pointer events and top value for this scene
    let enabledSceneNativeProps = {
      style: {
        top: sceneStyle.top,
        bottom: sceneStyle.bottom,
      },
    };
    if (sceneIndex !== this.state.transitionFromIndex &&
        sceneIndex !== this.state.presentedIndex) {
      // If we are not in a transition from this index, make sure opacity is 0
      // to prevent the enabled scene from flashing over the presented scene
      enabledSceneNativeProps.style.opacity = 0;
    }
    if (this.refs['scene_' + sceneIndex]) {
      this.refs['scene_' + sceneIndex].style = enabledSceneNativeProps;
    }
  }

  _cleanScenesPastIndex(index) {
    let newStackLength = index + 1;
    // Remove any unneeded rendered routes.
    if (newStackLength < this.state.routeStack.length) {
      this.setState({
        routeStack: this.state.routeStack.slice(0, newStackLength),
      });
    }
  }

  _transitionTo(index) {
    //TODO: Add support for scene transition animations
    this._hideScenes();
  }

  jumpTo(route) {
    let destIndex = this.state.routeStack.indexOf(route);
    invariant(
      destIndex !== -1,
      'Cannot jump to route that is not in the route stack'
    );
    this._jumpN(destIndex - this.state.presentedIndex);
  }

  jumpForward() {
    this._jumpN(1);
  }

  jumpBack() {
    this._jumpN(-1);
  }

  push(route) {
    invariant(!!route, 'Must supply route to push');
    let activeLength = this.state.presentedIndex + 1;
    let activeStack = this.state.routeStack.slice(0, activeLength);
    let nextStack = activeStack.concat([route]);
    let destIndex = nextStack.length - 1;
    this._emitWillFocus(nextStack[destIndex]);
    this.setState({
      routeStack: nextStack,
    }, () => {
      this._enableScene(destIndex);
      this._transitionTo(destIndex);
    });
  }

  pop() {
    if (this.state.transitionQueue.length) {
      // This is the workaround to prevent user from firing multiple `pop()`
      // calls that may pop the routes beyond the limit.
      // Because `this.state.presentedIndex` does not update until the
      // transition starts, we can't reliably use `this.state.presentedIndex`
      // to know whether we can safely keep popping the routes or not at this
      //  moment.
      return;
    }

    if (this.state.presentedIndex > 0) {
      this._popN(1);
    }
  }

  /**
   * Replace a route in the navigation stack.
   *
   * `index` specifies the route in the stack that should be replaced.
   * If it's negative, it counts from the back.
   */
  replaceAtIndex(route, index, cb) {
    invariant(!!route, 'Must supply route to replace');
    if (index < 0) {
      index += this.state.routeStack.length;
    }

    if (this.state.routeStack.length <= index) {
      return;
    }

    let nextRouteStack = this.state.routeStack.slice();
    if (index === this.state.presentedIndex) {
      this._emitWillFocus(route);
    }
    this.setState({
      routeStack: nextRouteStack,
    }, () => {
      if (index === this.state.presentedIndex) {
        this._emitDidFocus(route);
      }
      cb && cb();
    });
  }

  /**
   * Replaces the current scene in the stack.
   */
  replace(route) {
    this.replaceAtIndex(route, this.state.presentedIndex);
  }

  /**
   * Replace the current route's parent.
   */
  replacePrevious(route) {
    this.replaceAtIndex(route, this.state.presentedIndex - 1);
  }

  popToRoute(route) {
    let indexOfRoute = this.state.routeStack.indexOf(route);
    invariant(
      indexOfRoute !== -1,
      'Calling popToRoute for a route that doesn\'t exist!'
    );
    let numToPop = this.state.presentedIndex - indexOfRoute;
    this._popN(numToPop);
  }

  popToTop() {
    this.popToRoute(this.state.routeStack[0]);
  }

  replacePreviousAndPop(route) {
    if (this.state.routeStack.length < 2) {
      return;
    }
    this.replacePrevious(route);
    this.pop();
  }

  resetTo(route) {
    invariant(!!route, 'Must supply route to push');
    this.replaceAtIndex(route, 0, () => {
      // Do not use popToRoute here, because race conditions could prevent the
      // route from existing at this time. Instead, just go to index 0
      if (this.state.presentedIndex > 0) {
        this._popN(this.state.presentedIndex);
      }
    });
  }

  getCurrentRoutes() {
    // Clone before returning to avoid caller mutating the stack
    return this.state.routeStack.slice();
  }

  _renderScene(route, i) {
    let disabledSceneStyle = null;
    if (i !== this.state.presentedIndex) {
      disabledSceneStyle = styles.disabledScene;
    }
    return (
      <div
        key={'scene_' + getRouteID(route)}
        ref={'scene_' + i}
        style={[styles.baseScene, this.props.sceneStyle, disabledSceneStyle]}>
        {this.props.renderScene( route, this)}
        </div>
    );
  }
  render() {
    let newRenderedSceneMap = new Map();
    let scenes = this.state.routeStack.map((route, index) => {
      let renderedScene = (this._renderedSceneMap.has(route) && index !== this.state.presentedIndex)
        ? this._renderedSceneMap.get(route)
        : this._renderScene(route, index);

        newRenderedSceneMap.set(route, renderedScene);
        return renderedScene;
    });
    this._renderedSceneMap = newRenderedSceneMap;

    return (
      <div style={[styles.container, this.props.style]}>
        {scenes}
      </div>
    );
  }
}

export default Navigator;

