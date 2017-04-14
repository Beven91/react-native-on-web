/**
 * 名称：服务端React同构应用程序入口
 * 日期：2016-11-04
 * 描述：用于将express类似的Web框架的get管道接管到react-router 并且实现react同构直出
 */

// 加载依赖
import ReactServerRequest from './request'
import WebAppRegistry from "./registry";
import fetch from './modules/fetch/node-fetch.js'

/**
 * React 服务端 Application类
 */
export default class ReactWebServerApplication {

  /**
   * 构造函数
   * @param {Object} context 上下文信息
   */
  constructor (context) {
    debugger;
    //启动应用名称
    const reactRunAppName = context.getRunReactAppName();    
    //设置要启动的react应用
    const registerApplication = WebAppRegistry.getApplication(reactRunAppName);
    // 附加上下文
    this.appContext = context
    //设置当前运行react app名称
    this.reactRunAppName = reactRunAppName;
    //要启动的App组件
    this.registerComponent = registerApplication.registerComponent; 
    //设置路由
    this.registerRoutes = registerApplication.registerRoutes;
  }

  /**
   * onRequest
   * @param req {ClientRequest}  当前请求对象
   * @param resp {IncomingMessage} 当前返回响应对象
   */
  handle (req, resp, next) {
    // 执行request处理
    return new ReactServerRequest(this).onRequest(req, resp, next)
  }
}