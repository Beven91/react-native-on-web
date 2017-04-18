'use strict';Object.defineProperty(exports,"__esModule",{value:true});










var keyOf=function keyOf(oneKeyObj){
var key=void 0;
for(key in oneKeyObj){
if(!oneKeyObj.hasOwnProperty(key)){
continue;
}
return key;
}
return null;
};exports.default=

keyOf;