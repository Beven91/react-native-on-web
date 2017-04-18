Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();




var _react=require("react");var _react2=_interopRequireDefault(_react);
var _PropTypes=require("../../PropTypes.js");var _PropTypes2=_interopRequireDefault(_PropTypes);
var _reactNativeWeb=require("react-native-web");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var

TabBarItemIOS=function(_React$Component){_inherits(TabBarItemIOS,_React$Component);function TabBarItemIOS(){_classCallCheck(this,TabBarItemIOS);return _possibleConstructorReturn(this,(TabBarItemIOS.__proto__||Object.getPrototypeOf(TabBarItemIOS)).apply(this,arguments));}_createClass(TabBarItemIOS,[{key:"_onClick",value:function _onClick(































































e){
if(this.props.onPress){
this.props.onPress(e);
}
if(this.props.handleTouchTap){
this.props.handleTouchTap(this.props.index);
}
}},{key:"render",value:function render()

{var _props=
this.props,style=_props.style,selected=_props.selected;
var textColor=selected?{color:this.props.tintColor}:{color:this.props.unselectedTintColor};
return(
_react2.default.createElement(_reactNativeWeb.View,{style:[styles.tab,style]},

this.props.badge?_react2.default.createElement(_reactNativeWeb.View,{style:styles.badge},_react2.default.createElement(_reactNativeWeb.Text,{style:styles.badgeText},this.props.badge)):'',

_react2.default.createElement(_reactNativeWeb.TouchableOpacity,{style:styles.link,onPress:this._onClick.bind(this)},
_react2.default.createElement(_reactNativeWeb.Image,{source:this.props.selected&&this.props.selectedIcon?this.props.selectedIcon:this.props.icon,style:styles.icon}),

_react2.default.createElement(_reactNativeWeb.Text,{style:[styles.title,textColor]},this.props.title))));



}}]);return TabBarItemIOS;}(_react2.default.Component);exports.default=TabBarItemIOS;process.env.NODE_ENV!=="production"?TabBarItemIOS.propTypes=_extends({},_reactNativeWeb.View.propTypes,{badge:_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string,_react2.default.PropTypes.number]),systemIcon:_react2.default.PropTypes.oneOf(['bookmarks','contacts','downloads','favorites','featured','history','more','most-recent','most-viewed','recents','search','top-rated']),icon:_PropTypes2.default.image,selectedIcon:_PropTypes2.default.image,onPress:_react2.default.PropTypes.func,renderAsOriginal:_react2.default.PropTypes.bool,selected:_react2.default.PropTypes.bool,title:_react2.default.PropTypes.string,unselectedTintColor:_reactNativeWeb.ColorPropType,tintColor:_reactNativeWeb.ColorPropType}):void 0;


var styles=_reactNativeWeb.StyleSheet.create({
tab:{
position:'relative',
overflow:'hidden',
width:50,
height:50,
justifyContent:'center',
alignItems:'center',
paddingTop:5},

link:{
width:'100%',
alignItems:'center',
outline:'none'},

badgeText:{
color:'#fff',
fontSize:8,
textAlign:'center'},

badge:{
position:'absolute',
top:2,
left:'60%',
backgroundColor:'#FF0000',
height:20,
minWidth:20,
borderRadius:10,
justifyContent:'center',
alignItems:'center',
zIndex:9999},

icon:{},

title:{
marginTop:4,
fontSize:9}});