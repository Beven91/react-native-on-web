




'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _reactNativeWeb=require("react-native-web");
var _createDOMElement=require("react-native-web/dist/modules/createDOMElement");var _createDOMElement2=_interopRequireDefault(_createDOMElement);
var _react=require("react");var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var PICKER='picker';var

Picker=function(_React$Component){_inherits(Picker,_React$Component);















function Picker(props){_classCallCheck(this,Picker);var _this=_possibleConstructorReturn(this,(Picker.__proto__||Object.getPrototypeOf(Picker)).call(this,
props));
_this.state={
selectedValue:_this.props.selectedValue};return _this;

}_createClass(Picker,[{key:"componentWillReceiveProps",value:function componentWillReceiveProps(

nextProps){
if(nextProps.selectedValue!=this.props.selectedValue){
this.setState({selectedValue:nextProps.selectedValue});
}
}},{key:"componentDidUpdate",value:function componentDidUpdate()

{
this._syncDefaultValue();
}},{key:"componentDidMount",value:function componentDidMount()

{
this._syncDefaultValue();
}},{key:"_syncDefaultValue",value:function _syncDefaultValue()




{
var selectedValue=this.state.selectedValue;

if((selectedValue||'').toString().replace(/\s/g,'')==''){
this.state.selectedValue=this.refs.picker.value;
}
}},{key:"_onChange",value:function _onChange(

event){

event.nativeEvent.newValue=this.refs[PICKER].value;

this.setState({selectedValue:event.nativeEvent.newValue});

if(this.props.onChange){
this.props.onChange(event);
}

if(this.props.onValueChange){
this.props.onValueChange(event.nativeEvent.newValue);
}
}},{key:"render",value:function render()

{var _props=
this.props,style=_props.style,children=_props.children;var
selectedValue=this.state.selectedValue;
return(0,_createDOMElement2.default)('select',{
children:children,
ref:PICKER,
value:selectedValue,
onChange:this._onChange.bind(this),
style:[styles.picker,style]});

}}]);return Picker;}(_react2.default.Component);Picker.defaultProps={selectedValue:""};exports.default=Picker;process.env.NODE_ENV!=="production"?Picker.propTypes={onValueChange:_react.PropTypes.func,selectedValue:_react.PropTypes.any}:void 0;


Picker.Item=_react2.default.createClass({displayName:"Item",
propTypes:{
value:_react.PropTypes.any,
label:_react.PropTypes.string},


render:function render(){
return _react2.default.createElement("option",{value:this.props.value},this.props.label);
}});



var styles={
picker:{
margin:10,
color:'inherit',
font:'inherit'}};