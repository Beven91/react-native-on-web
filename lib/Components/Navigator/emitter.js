'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};

var _EventEmitter2=require('./lib/emitter/EventEmitter');var _EventEmitter3=_interopRequireDefault(_EventEmitter2);
var _event=require('./event');var _event2=_interopRequireDefault(_event);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var







NavigationEventEmitter=function(_EventEmitter){_inherits(NavigationEventEmitter,_EventEmitter);




function NavigationEventEmitter(target){_classCallCheck(this,NavigationEventEmitter);var _this=_possibleConstructorReturn(this,(NavigationEventEmitter.__proto__||Object.getPrototypeOf(NavigationEventEmitter)).call(this));

_this._emitting=false;
_this._emitQueue=[];
_this._target=target;return _this;
}_createClass(NavigationEventEmitter,[{key:'emit',value:function emit(


eventType,
data,
didEmitCallback)
{
if(this._emitting){


this._emitQueue.push({eventType:eventType,data:data,didEmitCallback:didEmitCallback});
return;
}

this._emitting=true;

var event=new _event2.default(eventType,this._target,data);



_get(NavigationEventEmitter.prototype.__proto__||Object.getPrototypeOf(NavigationEventEmitter.prototype),'emit',this).call(this,String(eventType),event);

if(typeof didEmitCallback==='function'){
didEmitCallback.call(this._target,event);
}
event.dispose();

this._emitting=false;

while(this._emitQueue.length){
var arg=this._emitQueue.shift();
this.emit(arg.eventType,arg.data,arg.didEmitCallback);
}
}}]);return NavigationEventEmitter;}(_EventEmitter3.default);exports.default=


NavigationEventEmitter;