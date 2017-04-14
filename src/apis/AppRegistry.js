/**
 * 名称：扩展react-native-web的AppRegistry
 * 日期：2017-04-14
 * 描述：用于支持react同构模式的AppRegistry
 */

//引入依赖>>
import {AppRegistry} from "react-native-web";

//原始registerComponent
const registerComponent = AppRegistry.registerComponent;
//原始getApplication
const getApplication = AppRegistry.getApplication;

//应用路由列表
const appRoutes = {};

/**
 * 注册web平台的应用程序组件
 * @param {String} appKey app名称
 * @param {Function} getComponentFunc 获取app组件函数
 * @param {Function} getRouterFunc 获取React路由组件函数
 */
AppRegistry.registerComponent  =function(appKey,getComponentFunc,getRouterFunc){
    if(typeof getRouterFunc=='function'){
        appRoutes[appKey] = getRouterFunc();
    }
    return registerComponent.call(this,appKey,getComponentFunc);
}

/**
 * 获取注册web平台的应用程序组件
 * @param {String} appKey app名称
 * @param {Function} appParameters 额外参数
 */
AppRegistry.getApplication  =function(appKey,appParameters){
    let application = getApplication.call(this,appKey,appParameters);
    application.routers = appRoutes[appKey];
    return application;
}
