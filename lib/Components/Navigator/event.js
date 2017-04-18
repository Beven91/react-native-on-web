'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _invariant=require('./lib/invariant');var _invariant2=_interopRequireDefault(_invariant);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var

NavigationEventPool=function(){


function NavigationEventPool(){_classCallCheck(this,NavigationEventPool);
this._list=[];
}_createClass(NavigationEventPool,[{key:'get',value:function get(

type,target,data){
var event=void 0;
if(this._list.length>0){
event=this._list.pop();
event.constructor.call(event,type,target,data);
}else{
event=new NavigationEvent(type,target,data);
}
return event;
}},{key:'put',value:function put(

event){
this._list.push(event);
}}]);return NavigationEventPool;}();


var _navigationEventPool=new NavigationEventPool();var

NavigationEvent=function(){_createClass(NavigationEvent,null,[{key:'pool',value:function pool(






type,target,data){
return _navigationEventPool.get(type,target,data);
}}]);

function NavigationEvent(type,target,data){_classCallCheck(this,NavigationEvent);
this._type=type;
this._target=target;
this._data=data;
this._defaultPrevented=false;
this._disposed=false;
}_createClass(NavigationEvent,[{key:'preventDefault',value:function preventDefault()





















{
this._defaultPrevented=true;
}},{key:'dispose',value:function dispose()






{
(0,_invariant2.default)(!this._disposed,'NavigationEvent is already disposed');
this._disposed=true;


this._type=null;
this._target=null;
this._data=null;
this._defaultPrevented=false;


_navigationEventPool.put(this);
}},{key:'type',get:function get(){return this._type;}},{key:'target',get:function get(){return this._target;}},{key:'data',get:function get(){return this._data;}},{key:'defaultPrevented',get:function get(){return this._defaultPrevented;}}]);return NavigationEvent;}();exports.default=


NavigationEvent;