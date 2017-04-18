Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();




var _reactNativeWeb=require('react-native-web');
var _react=require('react');var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var AnimateValue=function AnimateValue(v){return new _reactNativeWeb.Animated.Value(v);};var
























































Modal=function(_React$Component){_inherits(Modal,_React$Component);

























































function Modal(props){_classCallCheck(this,Modal);var _this=_possibleConstructorReturn(this,(Modal.__proto__||Object.getPrototypeOf(Modal)).call(this,
props));

_this.initAnimation();

_this.state=_this.initState();return _this;
}_createClass(Modal,[{key:'initAnimation',value:function initAnimation()




{
this.screenWidth=_reactNativeWeb.Dimensions.get('window').width;
this.translateX=AnimateValue(0);
this.opacity=AnimateValue(0);

this.createAnimations={
slide:this.slideAnimation.bind(this),
fade:this.fadeAnimation.bind(this)};

}},{key:'initState',value:function initState()




{
var state={
initStyle:this.getInitialStyle(state),
shouldUpdate:false};

return state;
}},{key:'getInitialStyle',value:function getInitialStyle(




state){var
transparent=this.props.transparent;
var modalStyle={backgroundColor:transparent?'transparent':'white',backfaceVisibility:'hidden'};
switch(this.getAnimationType()){
case"slide":
var interpolate=this.translateX.interpolate({
inputRange:[0,1],
outputRange:[this.screenWidth,0]});

modalStyle.transform=[{translate3d:'0,0,0'},{translateX:interpolate}];
break;
case"fade":
var interpolate2=this.opacity.interpolate({
inputRange:[0,1],
outputRange:[0,1]});

modalStyle.opacity=interpolate2;
break;
default:
break;}

return modalStyle;
}},{key:'componentWillReceiveProps',value:function componentWillReceiveProps(




nextProps){var _this2=this;
if(nextProps.visible!==this.props.visible){
var playAnimation=function playAnimation(){return _this2.playAnimation();};
if(nextProps.visible){
this.setState({shouldUpdate:true},playAnimation);
}else{
setTimeout(playAnimation,20);
}
}
}},{key:'componentDidMount',value:function componentDidMount()




{
if(this.props.visible){

this.playAnimation();
}
}},{key:'shouldComponentUpdate',value:function shouldComponentUpdate(




a,state){
return state.shouldUpdate;
}},{key:'componentDidUpdate',value:function componentDidUpdate()




{
this.setState({shouldUpdate:false});
}},{key:'render',value:function render()




{
if(!this.props.visible){
return null;
}
return(
_react2.default.createElement(_reactNativeWeb.Animated.View,{style:[styles.modal,this.state.initStyle],onStartShouldSetResponder:this._shouldSetResponder.bind(this)},
this.props.children));


}},{key:'playAnimation',value:function playAnimation()




{
var createAnimation=this.createAnimations[this.getAnimationType()];
if(createAnimation){
createAnimation().start(this.onPlayedAnimate.bind(this));
}else{
this.triggerVisibleHandler();
}
}},{key:'onPlayedAnimate',value:function onPlayedAnimate()




{
this.triggerVisibleHandler();
}},{key:'getAnimationType',value:function getAnimationType()




{
return this.props.animationType||"slide";
}},{key:'triggerVisibleHandler',value:function triggerVisibleHandler()




{var _this3=this;
if(this.props.visible===false){

this.setState({shouldUpdate:true});
setTimeout(function(){return _this3.emit(_this3.props.onRequestClose);},20);
}else{
this.emit(this.props.onShow);
}
}},{key:'slideAnimation',value:function slideAnimation()




{
var toValue=this.props.visible?1:0;

return _reactNativeWeb.Animated.timing(this.translateX,{toValue:toValue,duration:200,easing:_reactNativeWeb.Easing.linear});
}},{key:'fadeAnimation',value:function fadeAnimation()




{
var toValue=this.props.visible?1:0;
return _reactNativeWeb.Animated.timing(this.opacity,{toValue:toValue,duration:300});
}},{key:'_shouldSetResponder',value:function _shouldSetResponder()


{
return true;
}},{key:'emit',value:function emit(






handler){
if(typeof handler==='function'){for(var _len=arguments.length,args=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){args[_key-1]=arguments[_key];}
return handler.apply(undefined,args);
}
}}]);return Modal;}(_react2.default.Component);Modal.isReactNativeComponent=true;Modal.defaultProps={visible:true};exports.default=Modal;process.env.NODE_ENV!=="production"?Modal.propTypes={animationType:_react.PropTypes.oneOf(['none','slide','fade']),transparent:_react.PropTypes.bool,visible:_react.PropTypes.bool,onRequestClose:_react.PropTypes.func,onShow:_react.PropTypes.func,animated:_react.PropTypes.bool,supportedOrientations:_react.PropTypes.arrayOf(_react.PropTypes.oneOf(['portrait','portrait-upside-down','landscape','landscape-left','landscape-right'])),onOrientationChange:_react.PropTypes.func}:void 0;


var styles=_reactNativeWeb.StyleSheet.create({
modal:{
position:'fixed',
left:0,
right:0,
bottom:0,
top:0,
backgroundColor:'#fff',
zIndex:10}});