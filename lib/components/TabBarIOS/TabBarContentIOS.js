Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();




var _react=require("react");var _react2=_interopRequireDefault(_react);
var _reactNativeWeb=require("react-native-web");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var

TabBarContentIOS=function(_React$Component){_inherits(TabBarContentIOS,_React$Component);












function TabBarContentIOS(props){_classCallCheck(this,TabBarContentIOS);return _possibleConstructorReturn(this,(TabBarContentIOS.__proto__||Object.getPrototypeOf(TabBarContentIOS)).call(this,
props));
}_createClass(TabBarContentIOS,[{key:"render",value:function render()




{
var inStyle={opacity:this.props.selected?1:0};
return(
_react2.default.createElement(_reactNativeWeb.View,_extends({},this.props,{style:[styles.tabContent,this.props.style,inStyle]}),this.props.children));

}}]);return TabBarContentIOS;}(_react2.default.Component);exports.default=TabBarContentIOS;process.env.NODE_ENV!=="production"?TabBarContentIOS.propTypes=_extends({},_reactNativeWeb.View.propTypes,{selected:_react.PropTypes.bool}):void 0;



var styles=_reactNativeWeb.StyleSheet.create({
tabContent:{
position:'absolute',
top:0,
bottom:0,
right:0,
left:0}});