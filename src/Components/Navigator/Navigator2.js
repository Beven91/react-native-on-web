/**
 * 名称：React-Native Navigator for Web
 * 日期：2017-04-18
 * 描述：无
 * @module Navigator
 */
import React, { PropTypes } from 'react';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { View} from "react-native-web";

export default class Navigator extends React.Component{

    /**
     * Navigator 属性类型定义
     */
    static propTypes = {
        configureScene: React.PropTypes.func,
        initialRoute: React.PropTypes.object,
        initialRouteStack: React.PropTypes.array,
        navigationBar: React.PropTypes.node,
        navigator: React.PropTypes.object,
        onDidFocus: React.PropTypes.func,
        onItemRef: React.PropTypes.func,
        onWillFocus: React.PropTypes.func,
        renderScene: React.PropTypes.func,
        sceneStyle: React.PropTypes.func,
    }

    /**
     * 默认属性
     */
    static defaultProps ={
        configureScene: this.configureScene
    }

    /**
     * 组件构造函数
     */
    constructor(props){
        super(props);
    }

    /**
     * 组件默认状态
     */
    state = {
        routeStack: this.props.initialRouteStack || [this.props.initialRoute],
        currentRoute: 0,
        mountedScenes: []
    }

    /**
     * 用来配置场景动画和手势。会带有两个参数调用，
     * 一个是当前的路由，一个是当前的路由栈。然后它应当返回一个场景配置对象
     */
    configureScene() {
        return 'onTop'
    }

    /**
     * 获取当前路由
     */
    _getCurrentRoute() {
        return this.state.routeStack[this.state.currentRoute];
    }

    /**
     * @method 获取当前场景
     */
    _getCurrentScene() {
        if (this.state.mountedScenes[this.state.currentRoute]) {
            return this.state.mountedScenes[this.state.currentRoute];
        } else {
            var Scene = this.props.renderScene(this.state.currentRoute, this);
            this.setState()
        }
    }

    /**
     * @method 获取当前栈里的路由，也就是push进来，没有pop掉的那些。
     */
    getCurrentRoutes() {
        return this.state.routeStack;
    }

    /**
     * @method 跳回之前的路由，当然前提是保留现在的，还可以再跳回来，会给你保留原样。
     */
    jumpBack() {
        this.setState({currentRoute: this.state.currentRoute-1})
    }

    /**
     * @method 上一个方法不是调到之前的路由了么，用这个跳回来就好了。
     */
    jumpForward() {
        this.setState({currentRoute: this.state.currentRoute+1})
    }

    /**
     * @method 跳转到已有的场景并且不卸载
     */
    jumpTo(route) {
        var position = this.state.routeStack.indexOf(route);
        if (position) {
            this.setState({
                currentRoute: position
            });
        }
    }

    /**
     * @method 跳转到新的场景，并且将场景入栈，你可以稍后跳转过去
     */
    push(route) {
        var routeStack = this.state.routeStack;
        routeStack.push(route);
        this.setState({
            currentRoute: this.state.currentRoute+1,
            routeStack: routeStack
        });
    }

    /**
     * @method 跳转回去并且卸载掉当前场景
     */
    pop() {
        var routeStack = this.state.routeStack;
        routeStack.splice(this.state.currentRoute, 1);
        this.setState({
            currentRoute: this.state.currentRoute-1,
            routeStack: routeStack
        });
    }

   /**
    * @method pop到栈中的第一个场景，卸载掉所有的其他场景
    */
    popToTop() {
        this.setState({
            currentRoute: 0,
            routeStack: [this.state.routeStack[0]]
        });
    }

    /**
     * @method 用一个新的路由替换掉当前场景
     */
    replace(route){
        
    }

    /**
     * 渲染组件
     */
    render() {
        var Scene = this.props.renderScene(this._getCurrentRoute(), this);

        //var Transition = this.props.configureScene(this.state.currentRoute);
        return (
            <View>
                <TransitionGroup transitionName="onTop" component="div" className="flex container">
                {Scene}
                </TransitionGroup>
                <View style={{display: 'none'}}></View>
            </View>);
    }
    /**
    pop() -
    replace(route) - Replace the current scene with a new route
    replaceAtIndex(route, index) - Replace a scene as specified by an index
    replacePrevious(route) - Replace the previous scene
    immediatelyResetRouteStack(routeStack) - Reset every scene with an array of routes
    popToRoute(route) - Pop to a particular scene, as specified by it's route. All scenes after it will be unmounted
    () -
     **/
}