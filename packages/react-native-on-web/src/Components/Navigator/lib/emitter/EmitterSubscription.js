'use strict';

import EventSubscription from "./EventSubscription"

/**
 * EmitterSubscription represents a subscription with listener and context data.
 */
class EmitterSubscription extends EventSubscription {

  /**
   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
   *   this subscription
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */
  constructor(subscriber, listener, context) {
    super(subscriber);
    this.listener = listener;
    this.context = context;
  }
}

export default EmitterSubscription;
