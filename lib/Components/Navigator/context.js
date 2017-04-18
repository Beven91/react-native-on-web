'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _emitter=require('./emitter');var _emitter2=_interopRequireDefault(_emitter);
var _invariant=require('./lib/invariant');var _invariant2=_interopRequireDefault(_invariant);

var _event=require('./event');var _event2=_interopRequireDefault(_event);
var _EventSubscription=require('./lib/emitter/EventSubscription');var _EventSubscription2=_interopRequireDefault(_EventSubscription);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var emptyFunction=function emptyFunction(){};var




NavigationContext=function(){



function NavigationContext(){_classCallCheck(this,NavigationContext);
this._eventEmitter=new _emitter2.default(this);
this._currentRoute=null;
this.addListener('willfocus',this._onFocus,this);
this.addListener('didfocus',this._onFocus,this);
}_createClass(NavigationContext,[{key:'addListener',value:function addListener(








eventType,
listener,
context)
{
var emitter=this._eventEmitter;
if(emitter){
return emitter.addListener(eventType,listener,context);
}
return{remove:emptyFunction};
}},{key:'emit',value:function emit(

eventType,data,didEmitCallback){
var emitter=this._eventEmitter;
if(emitter){
emitter.emit(eventType,data,didEmitCallback);
}
}},{key:'dispose',value:function dispose()

{
var emitter=this._eventEmitter;
if(emitter){

emitter.removeAllListeners();
this._eventEmitter=null;
this._currentRoute=null;
}
}},{key:'_onFocus',value:function _onFocus(

event){
(0,_invariant2.default)(
event.data&&event.data.hasOwnProperty('route'),
'didfocus event should provide route');

this._currentRoute=event.data.route;
}},{key:'currentRoute',get:function get(){return this._currentRoute;}}]);return NavigationContext;}();exports.default=


NavigationContext;