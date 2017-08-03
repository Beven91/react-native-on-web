Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src\\Components\\ToastAndroid\\ToastAndroid.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();



var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNativeWeb=require('react-native-web');
var _reactDom=require('react-dom');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}


var SHORT=2000;


var LONG=3500;

var AnimateValue=function AnimateValue(v){return new _reactNativeWeb.Animated.Value(v);};

var singleInstance=null;var

Toast=function(_React$Component){_inherits(Toast,_React$Component);_createClass(Toast,null,[{key:'show',value:function show(










message){var duration=arguments.length>1&&arguments[1]!==undefined?arguments[1]:SHORT;var callback=arguments[2];
var document=global.document;
if(!document){
return;
}else if(singleInstance){
singleInstance.show(message,duration,callback);
}
}},{key:'showWithGravity',value:function showWithGravity(

message,duration){
return this.show.apply(this,arguments);
}},{key:'init',value:function init()





{var duration=arguments.length>0&&arguments[0]!==undefined?arguments[0]:SHORT;
if(!singleInstance){
var container=document.createElement('div');
document.body.appendChild(container);
(0,_reactDom.render)(_react2.default.createElement(Toast,{message:"",duration:duration,__source:{fileName:_jsxFileName,lineNumber:51}}),container);
}
}}]);













function Toast(props){var _ret;_classCallCheck(this,Toast);var _this=_possibleConstructorReturn(this,(Toast.__proto__||Object.getPrototypeOf(Toast)).call(this,
props));
_this.state=_this.getInitState(props.message,props.duration);
singleInstance=_this;
_this.handlers=[];
return _ret=singleInstance,_possibleConstructorReturn(_this,_ret);
}_createClass(Toast,[{key:'render',value:function render()




{
if(this.state.remove){
return null;
}
return(
_react2.default.createElement(_reactNativeWeb.Animated.View,{style:
[
styles.toast,
{
transform:[
{scale:this.state.scale}]}],__source:{fileName:_jsxFileName,lineNumber:83}},



_react2.default.createElement(_reactNativeWeb.Text,{style:styles.toastInner,__source:{fileName:_jsxFileName,lineNumber:92}},this.state.message)));


}},{key:'getInitState',value:function getInitState(




message,duration){
return{
message:message,
duration:duration,
showing:false,
remove:true,
scale:AnimateValue(1.185),
toScale:1};

}},{key:'show',value:function show(




message,duration,callback){var _this2=this;
if(typeof callback=='function'){
this.handlers.push(callback);
}
setTimeout(function(){
var state={duration:duration,remove:false,message:message,showing:true,scale:AnimateValue(1.185),toScale:1};
_this2.changeStatePlayAnimate(state);
},20);
}},{key:'hide',value:function hide()




{
var state={remove:false,showing:false,scale:AnimateValue(1),toScale:0.85};
this.changeStatePlayAnimate(state);
}},{key:'changeStatePlayAnimate',value:function changeStatePlayAnimate(




state){var _this3=this;
this.setState(state,function(){_this3.playAnimate();});
}},{key:'playAnimate',value:function playAnimate()




{
_reactNativeWeb.Animated.parallel([this.scaleAnimation()]).start(this.playedAnimate.bind(this));
}},{key:'playedAnimate',value:function playedAnimate()




{
if(this.state.showing){
this.waiting();
}else{
for(var _iterator=this.handlers,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==='function'?Symbol.iterator:'@@iterator']();;){var _ref;if(_isArray){if(_i>=_iterator.length)break;_ref=_iterator[_i++];}else{_i=_iterator.next();if(_i.done)break;_ref=_i.value;}var handler=_ref;
handler();
}
this.handlers.length=0;
this.setState({remove:true});
}
}},{key:'scaleAnimation',value:function scaleAnimation()




{
return _reactNativeWeb.Animated.timing(this.state.scale,{toValue:this.state.toScale,duration:200});
}},{key:'waiting',value:function waiting()




{
clearTimeout(this.timerId);
this.timerId=setTimeout(this.hide.bind(this),this.state.duration);
}}]);return Toast;}(_react2.default.Component);Toast.SHORT=SHORT;Toast.LONG=LONG;exports.default=Toast;process.env.NODE_ENV!=="production"?Toast.propTypes={message:_react.PropTypes.string.isRequired,duration:_react.PropTypes.number,timer:_react.PropTypes.number}:void 0;


if(typeof window!='undefined'){
Toast.init();
}

var styles=_reactNativeWeb.StyleSheet.create({
toast:{
position:'fixed',
zIndex:100,
width:'100%',
left:0,
bottom:'15%',
justifyContent:'center',
alignItems:'center'},

toastInner:{
fontSize:14,
lineHeight:22,
color:'#ffffff',
borderRadius:4,
display:'inline-block',
backgroundColor:'rgba(0,0,0,.65)',
paddingLeft:20,
paddingRight:20,
paddingBottom:10,
paddingTop:10,
marginLeft:25,
marginRight:25}});