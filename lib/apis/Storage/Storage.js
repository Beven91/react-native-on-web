var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}





var cache={};var

MemoeryStorage=function(){

function MemoeryStorage(isSessionStorage){_classCallCheck(this,MemoeryStorage);}_createClass(MemoeryStorage,[{key:"key",value:function key(





index){
return Object.keys(cache)[index];
}},{key:"getItem",value:function getItem(

key){
return cache[key];
}},{key:"setItem",value:function setItem(

key,data){
cache[key]=data;
}},{key:"removeItem",value:function removeItem(

key){
if(key in cache){
delete cache[key];
}
}},{key:"clear",value:function clear()

{
cache={};
}},{key:"length",get:function get(){return Object.keys(cache).length;}}]);return MemoeryStorage;}();


module.exports=global.localStorage?global.localStorage:new MemoeryStorage();