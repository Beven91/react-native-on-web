Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};





var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNativeWeb=require('react-native-web');var _reactNativeWeb2=_interopRequireDefault(_reactNativeWeb);
var _Modal=require('./components/Modal/Modal');var _Modal2=_interopRequireDefault(_Modal);
var _ToastAndroid=require('./components/ToastAndroid/ToastAndroid');var _ToastAndroid2=_interopRequireDefault(_ToastAndroid);
var _TabBarIOS=require('./components/TabBarIOS/TabBarIOS');var _TabBarIOS2=_interopRequireDefault(_TabBarIOS);
var _Picker=require('./components/Picker/Picker');var _Picker2=_interopRequireDefault(_Picker);
var _StatusBar=require('./components/StatusBar/StatusBar');var _StatusBar2=_interopRequireDefault(_StatusBar);
var _AsyncStorage=require('./apis/AsyncStorage');var _AsyncStorage2=_interopRequireDefault(_AsyncStorage);
var _LayoutAnimation=require('./apis/LayoutAnimation/LayoutAnimation.js');var _LayoutAnimation2=_interopRequireDefault(_LayoutAnimation);
var _Navigator=require('./components/Navigator');var _Navigator2=_interopRequireDefault(_Navigator);
var _webpackCodeSpliter=require('webpack-code-spliter');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

_extends(_reactNativeWeb2.default,_react2.default,{
Modal:_Modal2.default,
ToastAndroid:_ToastAndroid2.default,
TabBarIOS:_TabBarIOS2.default,
Picker:_Picker2.default,
StatusBar:_StatusBar2.default,
AsyncStorage:_AsyncStorage2.default,
Navigator:_Navigator2.default,
LayoutAnimation:_LayoutAnimation2.default,
getRoutejs:_webpackCodeSpliter.getRoutejs});


module.exports=_reactNativeWeb2.default;exports.default=_reactNativeWeb2.default;