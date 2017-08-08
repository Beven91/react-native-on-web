





var _react=require('react');

var Types={
spring:true,
linear:true,
easeInEaseOut:true,
easeIn:true,
easeOut:true,
keyboard:true};


var Properties={
opacity:true,
scaleXY:true};


var animType=_react.PropTypes.shape({
duration:_react.PropTypes.number,
delay:_react.PropTypes.number,
springDamping:_react.PropTypes.number,
initialVelocity:_react.PropTypes.number,
type:_react.PropTypes.oneOf(
Object.keys(Types)).
isRequired,
property:_react.PropTypes.oneOf(
Object.keys(Properties))});



var configType=_react.PropTypes.shape({
duration:_react.PropTypes.number.isRequired,
create:animType,
update:animType,
delete:animType});



function checkConfig(config,locationring,name){
(0,_react.checkPropTypes)({config:configType},{config:config},locationring,name);
}

function configureNext(config,onAnimationDidEnd){
}

function create(duration,type,creationProp){
return{
duration:duration,
create:{
type:type,
property:creationProp},

update:{
type:type},

delete:{
type:type,
property:creationProp}};


}

var Presets={
easeInEaseOut:create(
300,Types.easeInEaseOut,Properties.opacity),

linear:create(
500,Types.linear,Properties.opacity),

spring:{
duration:700,
create:{
type:Types.linear,
property:Properties.opacity},

update:{
type:Types.spring,
springDamping:0.4},

delete:{
type:Types.linear,
property:Properties.opacity}}};














var LayoutAnimation={














configureNext:configureNext,



create:create,
Types:Types,
Properties:Properties,
checkConfig:checkConfig,
Presets:Presets,
easeInEaseOut:configureNext.bind(
null,Presets.easeInEaseOut),

linear:configureNext.bind(
null,Presets.linear),

spring:configureNext.bind(
null,Presets.spring)};



module.exports=LayoutAnimation;