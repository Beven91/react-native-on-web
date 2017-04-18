'use strict';Object.defineProperty(exports,"__esModule",{value:true});












var invariant=function invariant(condition,format,a,b,c,d,e,f){
if(!condition){
var error=void 0;
if(typeof format==='undefined'){
error=new Error(
'Minified exception occurred; use the non-minified dev environment '+
'for the full error message and additional helpful warnings.');

}else{
var args=[a,b,c,d,e,f];
var argIndex=0;
error=new Error(
'Invariant Violation: '+
format.replace(/%s/g,function(){return args[argIndex++];}));

}

error.framesToPop=1;
throw error;
}
};exports.default=

invariant;