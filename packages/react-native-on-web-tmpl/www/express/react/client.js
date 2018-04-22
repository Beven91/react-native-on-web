/**
 * 名称：客户端React同构应用程序入口
 * 日期：2016-11-04
 * 描述：将服务器返回的页面的数据在浏览器进行本地初始化，以实现同构
 */

// 加载依赖
import 'babel-polyfill';
import './polyfill/resize-observer';
import './fetch/browser-fetch.js';
import 'react-native-on-web-index-web-js';
import ReactAppContext from './context';
import { AppRegistry } from 'react-native';

/**
 * React App类
 */
class ReactClientApp {

  /**
   * 构造函数
   */
  constructor(...params) {
    this.initialize(...params)
  }

  /**
   * 初始化应用程序
   */
  initialize() {
    this.reactAppContext = ReactAppContext.context;
  }

  /**
   * 启动应用程序
   */
  runApplication() {
    const { appName } = this.reactAppContext || {};
    const keys = AppRegistry.getAppKeys();
    const runApp = appName || keys[0];
    AppRegistry.runApplication(runApp, { rootTag: document.getElementById('app') })
  }
}

// 初始化客户端实例
let clientReactApplication = new ReactClientApp();

//启动程序
clientReactApplication.runApplication();
