'use strict';

import invariant from './lib/invariant';

class NavigationEventPool {
  _list: Array<any>;

  constructor() {
    this._list = [];
  }

  get(type: string, target: Object, data: any): NavigationEvent {
    let event;
    if (this._list.length > 0) {
      event = this._list.pop();
      event.constructor.call(event, type, target, data);
    } else {
      event = new NavigationEvent(type, target, data);
    }
    return event;
  }

  put(event: NavigationEvent) {
    this._list.push(event);
  }
}

let _navigationEventPool = new NavigationEventPool();

class NavigationEvent {
  _data: any;
  _defaultPrevented: boolean;
  _disposed: boolean;
  _target: ?Object;
  _type: ?string;

  static pool(type: string, target: Object, data: any): NavigationEvent {
    return _navigationEventPool.get(type, target, data);
  }

  constructor(type: string, target: Object, data: any) {
    this._type = type;
    this._target = target;
    this._data = data;
    this._defaultPrevented = false;
    this._disposed = false;
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get type(): string {
    return this._type;
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get target(): Object {
    return this._target;
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get data(): any {
    return this._data;
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  preventDefault(): void {
    this._defaultPrevented = true;
  }

  /**
   * Dispose the event.
   * NavigationEvent shall be disposed after being emitted by
   * `NavigationEventEmitter`.
   */
  dispose(): void {
    invariant(!this._disposed, 'NavigationEvent is already disposed');
    this._disposed = true;

    // Clean up.
    this._type = null;
    this._target = null;
    this._data = null;
    this._defaultPrevented = false;

    // Put this back to the pool to reuse the instance.
    _navigationEventPool.put(this);
  }
}

export default NavigationEvent;

