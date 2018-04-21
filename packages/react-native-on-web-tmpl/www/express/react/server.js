/**
 * 名称：服务端React同构应用程序入口
 * 日期：2016-11-04
 * 描述：用于将express类似的Web框架的get管道接管到react-router 并且实现react同构直出
 */

// 加载依赖
import './fetch/node-fetch'
import urlParser from 'url'
import path from 'path';
import fs from 'fs';
import { AppRegistry } from 'react-native'
import ReactServerRequest from './request'
import ReactAppContext from './context'

const SPLITERFILE = path.resolve('spliter.json');

/**
 * React 服务端 Application类
 */
export default class ReactWebServerApplication {

  /**
   * 构造函数
   * @param {Object} context 上下文信息
   */
  constructor(context) {
    // 附加上下文
    this.appContext = context
    // react 部分全局对象
    this.reactAppContext = ReactAppContext.context = {
      routePath: '',
      route: new SideRoute(),
      initialState: {
      }
    }
    this.splitRoutes = fs.existsSync(SPLITERFILE) ? require(SPLITERFILE) : {};
  }

  /**
   * onRequest
   * @param req {ClientRequest}  当前请求对象
   * @param resp {IncomingMessage} 当前返回响应对象
   */
  handle(req, resp, next) {
    let currentRoutePath = urlParser.parse(req.originalUrl || '').pathname || ''
    let routePath = currentRoutePath.split('/').slice(1).join('/')
    let reactAppContext = this.reactAppContext
    // 加载index.web.js
    require('react-native-on-web-index-web-js')
    // 启动应用名称
    const reactRunAppName = this.appContext.getRunReactAppName() || AppRegistry.getAppKeys()[0]
    // 设置当前运行react app名称
    this.reactRunAppName = reactRunAppName
    // 设置当前启动app名称
    reactAppContext.appName = reactRunAppName
    // 设置当前访问路径
    reactAppContext.routePath = routePath
    // 设置初始化状态
    reactAppContext.initialState = reactAppContext.route.initialState
    // 执行request处理
    return new ReactServerRequest(this).onRequest(req, resp, next)
  }
}

/**
 * 动态路由信息类
 */
class SideRoute extends String {
  /**
   * 重写toString 返回当前路由路径
   */
  toString() {
    return this.routeName
  }

  /**
   * 设置当前路由是否匹配成功
   * @param title 匹配成功标题
   * @param initialState 匹配成功的状态数据
   */
  setMatchRoute(title, initialState) {
    this.title = title
    this.isMatched = true
    this.initialState = initialState || {}
  }

  /**
   * 获取当前路由的页面标题
   */
  get title() {
    return this._title
  }

  /**
   * 设置当前路由的页面标题
   */
  set title(value) {
    this._title = value
  }

  get routeName() {
    return ReactAppContext.context.routePath
  }
}
