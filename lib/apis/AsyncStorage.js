Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();






var _deepAssign=require('deep-assign');var _deepAssign2=_interopRequireDefault(_deepAssign);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var mergeLocalStorageItem=function mergeLocalStorageItem(key,value){
var oldValue=window.localStorage.getItem(key);
var oldObject=JSON.parse(oldValue);
var newObject=JSON.parse(value);
var nextValue=JSON.stringify((0,_deepAssign2.default)({},oldObject,newObject));
window.localStorage.setItem(key,nextValue);
};

var handlePromise=function handlePromise(callback,handler){
return new Promise(function(resolve,reject){
try{
var v=handler();
callback&&callback(null,v);
resolve(v);
}catch(ex){
callback&&callback(ex);
reject(ex);
}
});

};var

AsyncStorage=function(){function AsyncStorage(){_classCallCheck(this,AsyncStorage);}_createClass(AsyncStorage,null,[{key:'clear',value:function clear(




callback){
return handlePromise(callback,function(){
window.localStorage.clear();
});
}},{key:'getAllKeys',value:function getAllKeys(





callback){
return handlePromise(callback,function(){
var numberOfKeys=window.localStorage.length;
var keys=[];
for(var i=0;i<numberOfKeys;i+=1){
var key=window.localStorage.key(i);
keys.push(key);
}
return keys;
});
}},{key:'getItem',value:function getItem(






key,callback){
return handlePromise(callback,function(){
return window.localStorage.getItem(key);
});
}},{key:'mergeItem',value:function mergeItem(







key,value,callback){
return handlePromise(callback,function(){
mergeLocalStorageItem(key,value);
});
}},{key:'multiGet',value:function multiGet(







keys,callback){
var promises=keys.map(function(key){return AsyncStorage.getItem(key);});
return Promise.all(promises).then(
function(result){
var v=result.map(function(value,i){return[keys[i],value];});
callback&&callback(null,v);
return Promise.resolve();
},
function(error){
callback&&callback(error);
return Promise.reject(error);
});

}},{key:'multiMerge',value:function multiMerge(






keyValuePairs,callback){
var promises=keyValuePairs.map(function(item){return AsyncStorage.mergeItem(item[0],item[1]);});
return Promise.all(promises).then(
function(result){
callback&&callback(null);
return Promise.resolve();
},
function(error){
callback&&callback(error);
return Promise.reject(error);
});

}},{key:'multiRemove',value:function multiRemove(






keys,callback){
var promises=keys.map(function(key){return AsyncStorage.removeItem(key);});
return Promise.all(promises).then(
function(result){
callback&&callback(null);
return Promise.resolve();
},
function(error){
callback&&callback(error);
return Promise.reject(error);
});

}},{key:'multiSet',value:function multiSet(






keyValuePairs,callback){
var promises=keyValuePairs.map(function(item){return AsyncStorage.setItem(item[0],item[1]);});
return Promise.all(promises).then(
function(result){
callback&&callback(null);
return Promise.resolve();
},
function(error){
callback&&callback(error);
return Promise.reject(error);
});

}},{key:'removeItem',value:function removeItem(






key,callback){
return handlePromise(callback,function(){return window.localStorage.removeItem(key);});
}},{key:'setItem',value:function setItem(







key,value,callback){
return handlePromise(callback,function(){return window.localStorage.setItem(key,value);});
}}]);return AsyncStorage;}();exports.default=AsyncStorage;