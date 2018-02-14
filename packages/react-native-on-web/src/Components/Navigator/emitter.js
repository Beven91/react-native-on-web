'use strict';

import EventEmitter from './lib/emitter/EventEmitter';
import NavigationEvent from './event';

type EventParams = {
  data: any;
  didEmitCallback: ?Function;
  eventType: string;
};

class NavigationEventEmitter extends EventEmitter {
  _emitQueue: Array<EventParams>;
  _emitting: boolean;
  _target: Object;

  constructor(target: Object) {
    super();
    this._emitting = false;
    this._emitQueue = [];
    this._target = target;
  }

  emit(
    eventType: string,
    data: any,
    didEmitCallback: ?Function
  ): void {
    if (this._emitting) {
      // An event cycle that was previously created hasn't finished yet.
      // Put this event cycle into the queue and will finish them later.
      this._emitQueue.push({eventType, data, didEmitCallback});
      return;
    }

    this._emitting = true;

    let event = new NavigationEvent(eventType, this._target, data);

    // EventEmitter#emit only takes `eventType` as `String`. Casting `eventType`
    // to `String` to make @flow happy.
    super.emit(String(eventType), event);

    if (typeof didEmitCallback === 'function') {
      didEmitCallback.call(this._target, event);
    }
    event.dispose();

    this._emitting = false;

    while (this._emitQueue.length) {
      let arg = this._emitQueue.shift();
      this.emit(arg.eventType, arg.data, arg.didEmitCallback);
    }
  }
}

export default NavigationEventEmitter;
