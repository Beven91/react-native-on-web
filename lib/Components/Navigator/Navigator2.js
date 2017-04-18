Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();





var _react=require('react');var _react2=_interopRequireDefault(_react);
var _ReactCSSTransitionGroup=require('react/lib/ReactCSSTransitionGroup');var _ReactCSSTransitionGroup2=_interopRequireDefault(_ReactCSSTransitionGroup);
var _reactNativeWeb=require('react-native-web');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var

Navigator=function(_React$Component){_inherits(Navigator,_React$Component);



























function Navigator(props){_classCallCheck(this,Navigator);var _this=_possibleConstructorReturn(this,(Navigator.__proto__||Object.getPrototypeOf(Navigator)).call(this,
props));_this.





state={
routeStack:_this.props.initialRouteStack||[_this.props.initialRoute],
currentRoute:0,
mountedScenes:[]};return _this;}_createClass(Navigator,[{key:'configureScene',value:function configureScene()






{
return'onTop';
}},{key:'_getCurrentRoute',value:function _getCurrentRoute()




{
return this.state.routeStack[this.state.currentRoute];
}},{key:'_getCurrentScene',value:function _getCurrentScene()




{
if(this.state.mountedScenes[this.state.currentRoute]){
return this.state.mountedScenes[this.state.currentRoute];
}else{
var Scene=this.props.renderScene(this.state.currentRoute,this);
this.setState();
}
}},{key:'getCurrentRoutes',value:function getCurrentRoutes()




{
return this.state.routeStack;
}},{key:'jumpBack',value:function jumpBack()




{
this.setState({currentRoute:this.state.currentRoute-1});
}},{key:'jumpForward',value:function jumpForward()




{
this.setState({currentRoute:this.state.currentRoute+1});
}},{key:'jumpTo',value:function jumpTo(




route){
var position=this.state.routeStack.indexOf(route);
if(position){
this.setState({
currentRoute:position});

}
}},{key:'push',value:function push(




route){
var routeStack=this.state.routeStack;
routeStack.push(route);
this.setState({
currentRoute:this.state.currentRoute+1,
routeStack:routeStack});

}},{key:'pop',value:function pop()




{
var routeStack=this.state.routeStack;
routeStack.splice(this.state.currentRoute,1);
this.setState({
currentRoute:this.state.currentRoute-1,
routeStack:routeStack});

}},{key:'popToTop',value:function popToTop()




{
this.setState({
currentRoute:0,
routeStack:[this.state.routeStack[0]]});

}},{key:'replace',value:function replace(




route){

}},{key:'render',value:function render()




{
var Scene=this.props.renderScene(this._getCurrentRoute(),this);


return(
_react2.default.createElement(_reactNativeWeb.View,null,
_react2.default.createElement(_ReactCSSTransitionGroup2.default,{transitionName:'onTop',component:'div',className:'flex container'},
Scene),

_react2.default.createElement(_reactNativeWeb.View,{style:{display:'none'}})));

}}]);return Navigator;}(_react2.default.Component);Navigator.defaultProps={configureScene:this.configureScene};exports.default=Navigator;process.env.NODE_ENV!=="production"?Navigator.propTypes={configureScene:_react2.default.PropTypes.func,initialRoute:_react2.default.PropTypes.object,initialRouteStack:_react2.default.PropTypes.array,navigationBar:_react2.default.PropTypes.node,navigator:_react2.default.PropTypes.object,onDidFocus:_react2.default.PropTypes.func,onItemRef:_react2.default.PropTypes.func,onWillFocus:_react2.default.PropTypes.func,renderScene:_react2.default.PropTypes.func,sceneStyle:_react2.default.PropTypes.func}:void 0;