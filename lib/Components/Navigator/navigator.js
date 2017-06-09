'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _react=require('react');var _react2=_interopRequireDefault(_react);
var _invariant=require('./lib/invariant');var _invariant2=_interopRequireDefault(_invariant);
var _context=require('./context');var _context2=_interopRequireDefault(_context);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var PropTypes=_react2.default.PropTypes;

var SCENE_DISABLED_NATIVE_PROPS='';
var styles={
baseScene:{
flex:1},

disabledSceneStyle:{},
container:{}};


var __uid=0;
function getuid(){
return __uid++;
}

function getRouteID(route){
if(route===null||typeof route!=='object'){
return String(route);
}

var key='__navigatorRouteID';

if(!route.hasOwnProperty(key)){
Object.defineProperty(route,key,{
enumerable:false,
configurable:false,
writable:false,
value:getuid()});

}
return route[key];
}var




























































Navigator=function(_React$Component){_inherits(Navigator,_React$Component);


















































function Navigator(props){_classCallCheck(this,Navigator);var _this=_possibleConstructorReturn(this,(Navigator.__proto__||Object.getPrototypeOf(Navigator)).call(this,
props));
_this._renderedSceneMap=new Map();

var routeStack=_this.props.initialRouteStack||[_this.props.initialRoute];
(0,_invariant2.default)(
routeStack.length>=1,
'Navigator requires props.initialRoute or props.initialRouteStack.');

var initialRouteIndex=routeStack.length-1;
if(_this.props.initialRoute){
initialRouteIndex=routeStack.indexOf(_this.props.initialRoute);
(0,_invariant2.default)(
initialRouteIndex!==-1,
'initialRoute is not in initialRouteStack.');

}

_this.state={
routeStack:routeStack,
presentedIndex:initialRouteIndex,
transitionFromIndex:null,
transitionQueue:[]};return _this;

}_createClass(Navigator,[{key:'immediatelyResetRouteStack',value:function immediatelyResetRouteStack(








nextRouteStack){
var destIndex=nextRouteStack.length-1;
this.setState({
routeStack:nextRouteStack,
presentedIndex:destIndex,
transitionFromIndex:null});

}},{key:'_emitDidFocus',value:function _emitDidFocus(

route){
this.navigationContext.emit('didfocus',{route:route});
}},{key:'_emitWillFocus',value:function _emitWillFocus(

route){
this.navigationContext.emit('willfocus',{route:route});
}},{key:'_getDestIndexWithinBounds',value:function _getDestIndexWithinBounds(

n){
var currentIndex=this.state.presentedIndex;
var destIndex=currentIndex+n;
(0,_invariant2.default)(
destIndex>=0,
'Cannot jump before the first route.');

var maxIndex=this.state.routeStack.length-1;
(0,_invariant2.default)(
maxIndex>=destIndex,
'Cannot jump past the last route.');

return destIndex;
}},{key:'_jumpN',value:function _jumpN(

n){
var destIndex=this._getDestIndexWithinBounds(n);
this._enableScene(destIndex);
this._emitWillFocus(this.state.routeStack[destIndex]);
this._transitionTo(destIndex);
}},{key:'_hideScenes',value:function _hideScenes()




{
for(var i=0;i<this.state.routeStack.length;i++){
if(i===this.state.presentedIndex||
i===this.state.transitionFromIndex){
continue;
}
this._disableScene(i);
}
}},{key:'_disableScene',value:function _disableScene(




sceneIndex){
if(this.refs['scene_'+sceneIndex]){
this.refs['scene_'+sceneIndex].getDOMNode().style=SCENE_DISABLED_NATIVE_PROPS;
}
}},{key:'_enableScene',value:function _enableScene(




sceneIndex){

var sceneStyle=_extends({},styles.baseScene,this.props.sceneStyle);

var enabledSceneNativeProps={
style:{
top:sceneStyle.top,
bottom:sceneStyle.bottom}};


if(sceneIndex!==this.state.transitionFromIndex&&
sceneIndex!==this.state.presentedIndex){


enabledSceneNativeProps.style.opacity=0;
}
if(this.refs['scene_'+sceneIndex]){
this.refs['scene_'+sceneIndex].style=enabledSceneNativeProps;
}
}},{key:'_cleanScenesPastIndex',value:function _cleanScenesPastIndex(

index){
var newStackLength=index+1;

if(newStackLength<this.state.routeStack.length){
this.setState({
routeStack:this.state.routeStack.slice(0,newStackLength)});

}
}},{key:'_transitionTo',value:function _transitionTo(

index){

this._hideScenes();
}},{key:'jumpTo',value:function jumpTo(

route){
var destIndex=this.state.routeStack.indexOf(route);
(0,_invariant2.default)(
destIndex!==-1,
'Cannot jump to route that is not in the route stack');

this._jumpN(destIndex-this.state.presentedIndex);
}},{key:'jumpForward',value:function jumpForward()

{
this._jumpN(1);
}},{key:'jumpBack',value:function jumpBack()

{
this._jumpN(-1);
}},{key:'push',value:function push(

route){var _this2=this;
(0,_invariant2.default)(!!route,'Must supply route to push');
var activeLength=this.state.presentedIndex+1;
var activeStack=this.state.routeStack.slice(0,activeLength);
var nextStack=activeStack.concat([route]);
var destIndex=nextStack.length-1;
this._emitWillFocus(nextStack[destIndex]);
this.setState({
routeStack:nextStack},
function(){
_this2._enableScene(destIndex);
_this2._transitionTo(destIndex);
});
}},{key:'pop',value:function pop()

{
if(this.state.transitionQueue.length){






return;
}

if(this.state.presentedIndex>0){
this._popN(1);
}
}},{key:'replaceAtIndex',value:function replaceAtIndex(







route,index,cb){var _this3=this;
(0,_invariant2.default)(!!route,'Must supply route to replace');
if(index<0){
index+=this.state.routeStack.length;
}

if(this.state.routeStack.length<=index){
return;
}

var nextRouteStack=this.state.routeStack.slice();
if(index===this.state.presentedIndex){
this._emitWillFocus(route);
}
this.setState({
routeStack:nextRouteStack},
function(){
if(index===_this3.state.presentedIndex){
_this3._emitDidFocus(route);
}
cb&&cb();
});
}},{key:'replace',value:function replace(




route){
this.replaceAtIndex(route,this.state.presentedIndex);
}},{key:'replacePrevious',value:function replacePrevious(




route){
this.replaceAtIndex(route,this.state.presentedIndex-1);
}},{key:'popToRoute',value:function popToRoute(

route){
var indexOfRoute=this.state.routeStack.indexOf(route);
(0,_invariant2.default)(
indexOfRoute!==-1,
'Calling popToRoute for a route that doesn\'t exist!');

var numToPop=this.state.presentedIndex-indexOfRoute;
this._popN(numToPop);
}},{key:'popToTop',value:function popToTop()

{
this.popToRoute(this.state.routeStack[0]);
}},{key:'replacePreviousAndPop',value:function replacePreviousAndPop(

route){
if(this.state.routeStack.length<2){
return;
}
this.replacePrevious(route);
this.pop();
}},{key:'resetTo',value:function resetTo(

route){var _this4=this;
(0,_invariant2.default)(!!route,'Must supply route to push');
this.replaceAtIndex(route,0,function(){


if(_this4.state.presentedIndex>0){
_this4._popN(_this4.state.presentedIndex);
}
});
}},{key:'getCurrentRoutes',value:function getCurrentRoutes()

{

return this.state.routeStack.slice();
}},{key:'_renderScene',value:function _renderScene(

route,i){
var disabledSceneStyle=null;
if(i!==this.state.presentedIndex){
disabledSceneStyle=styles.disabledScene;
}
return(
_react2.default.createElement('div',{
key:'scene_'+getRouteID(route),
ref:'scene_'+i,
style:[styles.baseScene,this.props.sceneStyle,disabledSceneStyle]},
this.props.renderScene(route,this)));


}},{key:'render',value:function render()
{var _this5=this;
var newRenderedSceneMap=new Map();
var scenes=this.state.routeStack.map(function(route,index){
var renderedScene=_this5._renderedSceneMap.has(route)&&index!==_this5.state.presentedIndex?
_this5._renderedSceneMap.get(route):
_this5._renderScene(route,index);

newRenderedSceneMap.set(route,renderedScene);
return renderedScene;
});
this._renderedSceneMap=newRenderedSceneMap;

return(
_react2.default.createElement('div',{style:[styles.container,this.props.style]},
scenes));


}},{key:'navigationContext',get:function get(){if(!this._navigationContext){this._navigationContext=new _context2.default();}return this._navigationContext;}}]);return Navigator;}(_react2.default.Component);process.env.NODE_ENV!=="production"?Navigator.propTypes={configureScene:PropTypes.func,renderScene:PropTypes.func.isRequired,initialRoute:PropTypes.object,initialRouteStack:PropTypes.arrayOf(PropTypes.object),navigator:PropTypes.object}:void 0;exports.default=


Navigator;