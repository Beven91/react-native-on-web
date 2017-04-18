'use strict';Object.defineProperty(exports,"__esModule",{value:true});

var ErrorUtils={
_inGuard:0,
_globalHandler:null,
setGlobalHandler:function setGlobalHandler(fun){
ErrorUtils._globalHandler=fun;
},
reportError:function reportError(error){
ErrorUtils._globalHandler&&ErrorUtils._globalHandler(error);
},
reportFatalError:function reportFatalError(error){
ErrorUtils._globalHandler&&ErrorUtils._globalHandler(error,true);
},
applyWithGuard:function applyWithGuard(fun,context,args){
try{
ErrorUtils._inGuard++;
return fun.apply(context,args);
}catch(e){
ErrorUtils.reportError(e);
}finally{
ErrorUtils._inGuard--;
}
},
applyWithGuardIfNeeded:function applyWithGuardIfNeeded(fun,context,args){
if(ErrorUtils.inGuard()){
return fun.apply(context,args);
}
ErrorUtils.applyWithGuard(fun,context,args);
},
inGuard:function inGuard(){
return ErrorUtils._inGuard;
},
guard:function guard(fun,name,context){
if(typeof fun!=='function'){

return null;
}
name=name||fun.name||'<generated guard>';
function guarded(){
return(
ErrorUtils.applyWithGuard(
fun,
context||this,
arguments,
null,
name));


}

return guarded;
}};exports.default=


ErrorUtils;