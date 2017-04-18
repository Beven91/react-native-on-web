'use strict';Object.defineProperty(exports,"__esModule",{value:true});








function copyProperties(obj,a,b,c,d,e,f){
obj=obj||{};

if(__DEV__){
if(f){
throw new Error('Too many arguments passed to copyProperties');
}
}

var args=[a,b,c,d,e];
var ii=0,v;
while(args[ii]){
v=args[ii++];
for(var k in v){
obj[k]=v[k];
}



if(v.hasOwnProperty&&v.hasOwnProperty('toString')&&
typeof v.toString!='undefined'&&obj.toString!==v.toString){
obj.toString=v.toString;
}
}

return obj;
}exports.default=

copyProperties;