'use strict';

import NavigationEventEmitter from './emitter';
import invariant from './lib/invariant';

import NavigationEvent from './event';
import EventSubscription from './lib/emitter/EventSubscription';

const emptyFunction = () => {};

/**
 * Class that contains the info and methods for app navigation.
 */
class NavigationContext {
  _eventEmitter: ?NavigationEventEmitter;
  _currentRoute: any;

  constructor() {
    this._eventEmitter = new NavigationEventEmitter(this);
    this._currentRoute = null;
    this.addListener('willfocus', this._onFocus, this);
    this.addListener('didfocus', this._onFocus, this);
  }

  // TODO: @flow does not like this getter. Will add @flow check back once
  // getter/setter is supported.
  get currentRoute(): any {
    return this._currentRoute;
  }

  addListener(
    eventType: string,
    listener: Function,
    context: ?Object
  ): EventSubscription {
    let emitter = this._eventEmitter;
    if (emitter) {
      return emitter.addListener(eventType, listener, context);
    }
    return {remove: emptyFunction};
  }

  emit(eventType: String, data: any, didEmitCallback: ?Function): void {
    let emitter = this._eventEmitter;
    if (emitter) {
      emitter.emit(eventType, data, didEmitCallback);
    }
  }

  dispose(): void {
    let emitter = this._eventEmitter;
    if (emitter) {
      // clean up everything.
      emitter.removeAllListeners();
      this._eventEmitter = null;
      this._currentRoute = null;
    }
  }

  _onFocus(event: NavigationEvent): void {
    invariant(
      event.data && event.data.hasOwnProperty('route'),
      'didfocus event should provide route'
    );
    this._currentRoute = event.data.route;
  }
}

export default NavigationContext;
