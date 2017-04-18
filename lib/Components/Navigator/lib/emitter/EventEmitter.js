'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _EmitterSubscription=require('./EmitterSubscription');var _EmitterSubscription2=_interopRequireDefault(_EmitterSubscription);
var _ErrorUtils=require('../ErrorUtils');var _ErrorUtils2=_interopRequireDefault(_ErrorUtils);
var _EventSubscriptionVendor=require('./EventSubscriptionVendor');var _EventSubscriptionVendor2=_interopRequireDefault(_EventSubscriptionVendor);
var _invariant=require('../invariant');var _invariant2=_interopRequireDefault(_invariant);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var emptyFunction=function emptyFunction(){};var














EventEmitter=function(){



function EventEmitter(){_classCallCheck(this,EventEmitter);
this._subscriber=new _EventSubscriptionVendor2.default();
}_createClass(EventEmitter,[{key:'addListener',value:function addListener(
















eventType,listener,context){
return this._subscriber.addSubscription(
eventType,
new _EmitterSubscription2.default(this._subscriber,listener,context));
}},{key:'once',value:function once(











eventType,listener,context){var _this=this,_arguments=arguments;
return this.addListener(eventType,function(){
_this.removeCurrentListener();
listener.apply(context,_arguments);
});
}},{key:'removeAllListeners',value:function removeAllListeners(








eventType){
this._subscriber.removeAllSubscriptions(eventType);
}},{key:'removeCurrentListener',value:function removeCurrentListener()






















{
(0,_invariant2.default)(
!!this._currentSubscription,
'Not in an emitting cycle; there is no current subscription');

this._subscriber.removeSubscription(this._currentSubscription);
}},{key:'listeners',value:function listeners(








eventType){
var subscriptions=this._subscriber.getSubscriptionsForType(eventType);
return subscriptions?
subscriptions.filter(emptyFunction.thatReturnsTrue).map(
function(subscription){
return subscription.listener;
}):
[];
}},{key:'emit',value:function emit(















eventType){
var subscriptions=this._subscriber.getSubscriptionsForType(eventType);
if(subscriptions){
var keys=Object.keys(subscriptions);
for(var ii=0;ii<keys.length;ii++){
var key=keys[ii];
var subscription=subscriptions[key];


if(subscription){
this._currentSubscription=subscription;

_ErrorUtils2.default.applyWithGuard(
subscription.listener,
subscription.context,
Array.prototype.slice.call(arguments,1),
null,
'EventEmitter:'+eventType);

}
}
this._currentSubscription=null;
}
}}]);return EventEmitter;}();


module.exports=EventEmitter;