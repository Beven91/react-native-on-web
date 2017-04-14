/**
 * 名称：客户端React同构应用程序入口
 * 日期：2016-11-04
 * 描述：将服务器返回的页面的数据在浏览器进行本地初始化，以实现同构
 */

//加载依赖
import "babel-polyfill";
import "../../index.web.js";
import React from 'react';
import WebAppRegistry from "./registry";
import { render } from 'react-dom';
import fetch from './modules/fetch/browser-fetch.js';

/**
 * React App类
 */
class ReactClientApp {

    /**
     * 构造函数
     */
    constructor(...params) {
        this.initialize(...params);
    }

    /**
     * 初始化应用程序
     */
    initialize() {
        window.__CLIENT__ = true;
        const reactAppContext = this.reactAppContext = window['@@__reactAppContext__@@'];
        const {appName,initialState} = reactAppContext;
        //启动appName
        this.registerApplication = WebAppRegistry.getApplication(appName);
        //获取服务器同构数据
        this.initialState = initialState;
        //开始执行本地渲染
        render(this.render(), document.getElementById('app'));
    }

    /**
     * 本地渲染
     */
    render() {
        let {registerComponent:App,registerRoutes} =this.registerApplication;
        return (
            <App>{registerRoutes}</App>
        );
    }
}

//初始化客户端实例
let clientReactApplication = new ReactClientApp();


