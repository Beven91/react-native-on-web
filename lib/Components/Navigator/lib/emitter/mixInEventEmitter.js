'use strict';

var EventEmitter=require('./EventEmitter');
var EventEmitterWithHolding=require('./EventEmitterWithHolding');
var EventHolder=require('./EventHolder');
var EventValidator=require('./EventValidator');

var copyProperties=require('../copyProperties');
var invariant=require('../invariant');
var keyOf=require('../keyOf');

var TYPES_KEY=keyOf({__types:true});






















function mixInEventEmitter(klass,types){
invariant(types,'Must supply set of valid event types');
invariant(!this.__eventEmitter,'An active emitter is already mixed in');



var target=klass.prototype||klass;

var ctor=klass.constructor;
if(ctor){
invariant(
ctor===Object||ctor===Function,
'Mix EventEmitter into a class, not an instance');

}



if(target.hasOwnProperty(TYPES_KEY)){
copyProperties(target.__types,types);
}else if(target.__types){
target.__types=copyProperties({},target.__types,types);
}else{
target.__types=types;
}
copyProperties(target,EventEmitterMixin);
}

var EventEmitterMixin={
emit:function emit(eventType,a,b,c,d,e,_){
return this.__getEventEmitter().emit(eventType,a,b,c,d,e,_);
},

emitAndHold:function emitAndHold(eventType,a,b,c,d,e,_){
return this.__getEventEmitter().emitAndHold(eventType,a,b,c,d,e,_);
},

addListener:function addListener(eventType,listener,context){
return this.__getEventEmitter().addListener(eventType,listener,context);
},

once:function once(eventType,listener,context){
return this.__getEventEmitter().once(eventType,listener,context);
},

addRetroactiveListener:function addRetroactiveListener(eventType,listener,context){
return this.__getEventEmitter().addRetroactiveListener(
eventType,
listener,
context);

},

addListenerMap:function addListenerMap(listenerMap,context){
return this.__getEventEmitter().addListenerMap(listenerMap,context);
},

addRetroactiveListenerMap:function addRetroactiveListenerMap(listenerMap,context){
return this.__getEventEmitter().addListenerMap(listenerMap,context);
},

removeAllListeners:function removeAllListeners(){
this.__getEventEmitter().removeAllListeners();
},

removeCurrentListener:function removeCurrentListener(){
this.__getEventEmitter().removeCurrentListener();
},

releaseHeldEventType:function releaseHeldEventType(eventType){
this.__getEventEmitter().releaseHeldEventType(eventType);
},

__getEventEmitter:function __getEventEmitter(){
if(!this.__eventEmitter){
var emitter=new EventEmitter();
emitter=EventValidator.addValidation(emitter,this.__types);

var holder=new EventHolder();
this.__eventEmitter=new EventEmitterWithHolding(emitter,holder);
}
return this.__eventEmitter;
}};


module.exports=mixInEventEmitter;