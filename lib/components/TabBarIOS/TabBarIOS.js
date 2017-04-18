Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();




var _react=require("react");var _react2=_interopRequireDefault(_react);
var _reactNativeWeb=require("react-native-web");
var _TabBarItemIOS=require("./TabBarItemIOS");var _TabBarItemIOS2=_interopRequireDefault(_TabBarItemIOS);
var _TabBarContentIOS=require("./TabBarContentIOS");var _TabBarContentIOS2=_interopRequireDefault(_TabBarContentIOS);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var

TabBarIOS=function(_React$Component){_inherits(TabBarIOS,_React$Component);




































function TabBarIOS(props){_classCallCheck(this,TabBarIOS);var _this=_possibleConstructorReturn(this,(TabBarIOS.__proto__||Object.getPrototypeOf(TabBarIOS)).call(this,
props));_this.





state={
selectedIndex:0};return _this;}_createClass(TabBarIOS,[{key:"handleTouchTap",value:function handleTouchTap(





index){
if(this.state.selectedIndex!=index){
this.setState({selectedIndex:index});
}
}},{key:"getPropsStyle",value:function getPropsStyle()




{
return{
backgroundColor:this.props.barTintColor,
opacity:this.props.translucent?0.5:1};

}},{key:"_renderContents",value:function _renderContents()




{var _this2=this;
var tabContents=[];
var selectedIndex=this.state.selectedIndex;
var tabs=_react2.default.Children.map(this.props.children,function(tab,index){
var selected=index==selectedIndex;
var children=tab.props.children;
if(tab.type.name!="TabBarItemIOS"){
var type=tab.type.displayName||tab.type.name||tab.type;
throw'Tabbar only accepts TabBar.Item Components as children. Found '+type+' as child number '+(index+1)+' of Tabbar';
}else if(children&&selected){
tabContents.push(_react2.default.createElement(_TabBarContentIOS2.default,{key:index,selected:selected},children));
}else{
tabContents.push(undefined);
}
return _react2.default.cloneElement(tab,{
index:index,
selected:selected,
unselectedTintColor:_this2.props.unselectedTintColor,
tintColor:_this2.props.tintColor,
handleTouchTap:_this2.handleTouchTap.bind(_this2)});

});
return{tabContents:tabContents,tabs:tabs};
}},{key:"render",value:function render()




{var _renderContents2=
this._renderContents(),tabContents=_renderContents2.tabContents,tabs=_renderContents2.tabs;
return(
_react2.default.createElement(_reactNativeWeb.View,{ref:"tabGroup",style:[styles.tabGroup,this.props.style]},
_react2.default.createElement(_reactNativeWeb.View,{ref:"tabContents",style:styles.tabContents},
tabContents),

_react2.default.createElement(_reactNativeWeb.View,{ref:"bar",style:[styles.bar,this.getPropsStyle()]},
tabs)));



}}]);return TabBarIOS;}(_react2.default.Component);TabBarIOS.Item=_TabBarItemIOS2.default;exports.default=TabBarIOS;process.env.NODE_ENV!=="production"?TabBarIOS.propTypes=_extends({},_reactNativeWeb.View.propTypes,{unselectedTintColor:_reactNativeWeb.ColorPropType,tintColor:_reactNativeWeb.ColorPropType,barTintColor:_reactNativeWeb.ColorPropType,translucent:_react2.default.PropTypes.bool,itemPositioning:_react2.default.PropTypes.oneOf(['fill','center','auto'])}):void 0;



var styles=_reactNativeWeb.StyleSheet.create({
tabGroup:{
flex:1,
flexDirection:'column'},

bar:{
height:50,
flexDirection:'row',
flexWrap:'nowrap',
justifyContent:'space-around'},

tabContents:{
flex:1,
flexDirection:'row'}});