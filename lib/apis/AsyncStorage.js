






var _reactNativeWeb=require('react-native-web');


Object.keys(_reactNativeWeb.AsyncStorage).map(function(key){return onNavigate(key);});





function onNavigate(key){
var handler=_reactNativeWeb.AsyncStorage[key];
if(typeof handler=='function'){
_reactNativeWeb.AsyncStorage[key]=onPromiseCallback(handler);
}
}





function onPromiseCallback(handler){
var callback=arguments[arguments.length-1];
var promise=handler.apply(_reactNativeWeb.AsyncStorage,arguments);
if(typeof promise.then==='function'&&typeof callback==='function'){
promise=promise.then(function(data){
callback(null,data);
return data;
}).catch(function(error){
callback(error);
return error;
});
}
return promise;
}