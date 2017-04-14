/**
 * 名称：处理get Http请求
 * 日期：2016-11-07
 * 描述：处理react-router 并且返回对应的容器组件
 */

//加载依赖
import React from "react";
import logger from "logger";
import { match,RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';

/**
 * React Request处理勒
 */
export default class ReactServerRequest {

    /**
     * 单例构造函数
     */
    constructor(...params) {
        this.initialize(...params);
    }

    /**
     * 初始化应用程序
     */
    initialize(reactApplication) {
        this.reactApplication  =reactApplication;
        //获取路由
        this.routes = reactApplication.registerRoutes;
        //启动app组件
        this.component = reactApplication.registerComponent;
    }


    /**
     * onRequest
     * @param req {ClientRequest}  当前请求对象
     * @param resp {IncomingMessage} 当前返回响应对象
     * @param next 下一步，如果没有做响应的话，可以使用此函数接管到下一管道运行
     */
    onRequest(req, resp, next) {
        this.currentRequest = req;
        this.currentResponse = resp;
        this.nextPiple = next;
        this.searchContext = { routes: this.routes, location: req.url };
        return match(this.searchContext, (...params) => this.doRequest(...params));
    }

    /**
     * 执行request
     * @param err 路由匹配异常
     * @param redirect  重定向信息
     * @param props  匹配到组件 执行props {params:路由参数信息,components:匹配到的组件列表}
     */
    doRequest(err, redirect, props) {
        if (err) {
            return this.doErrorResponse(err);
        } else if (redirect) {
            return this.doRedirect(redirect.pathname + redirect.search);
        } else if (props) {
            return this.doReactResponse(props);
        } else {
            this.toNextPiple();
        }
    }

    /**
     * 交管到一下管道运行
     */
    toNextPiple(err) {
        if (this.nextPiple) {
            this.nextPiple(err);
        }
    }

    /**
     * 执行React同构应用
     * @param props
     */
    doReactResponse(props) {
        try {
            let reactApplication = this.reactApplication;
            let App = this.component;
            let route = props.routes.find((route) => (route && route.title)) || {};
            let components = renderToString(<App><RouterContext {...props} /></App>)
            //调用视图引擎返回页面
            let options = {
                title: (route.title || "React Native for web"),
                components: components,
                reactAppContext:JSON.stringify({
                    appName:reactApplication.reactRunAppName,
                    initialState:{

                    }
                })
            };
            this.currentResponse.status(200).render('react', options);
        } catch (ex) {
            this.doErrorResponse(ex);
        }
    }


    /**
     * 重定向处理
     * @param redirect 重定向信息对象
     */
    doRedirect(url) {
        if (this.currentResponse) {
            this.currentResponse.redirect(302, url);
        }
    }

    /**
     * 处理error的路由返回
     * @param error 错误消息对象
     */
    doErrorResponse(error) {
        this.toNextPiple(error);
    }
}
