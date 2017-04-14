






var _reactNativeWeb=require("react-native-web");


var registerComponent=_reactNativeWeb.AppRegistry.registerComponent;

var getApplication=_reactNativeWeb.AppRegistry.getApplication;


var appRoutes={};







_reactNativeWeb.AppRegistry.registerComponent=function(appKey,getComponentFunc,getRouterFunc){
appRoutes[appKey]=getRouterFunc();
return registerComponent.call(this,appKey,getComponentFunc);
};






_reactNativeWeb.AppRegistry.getApplication=function(appKey,appParameters){
var application=getApplication.call(this,appKey,appParameters);
application.routers=appRoutes[appKey];
return application;
};