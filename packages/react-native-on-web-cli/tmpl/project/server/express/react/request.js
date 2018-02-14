/**
 * 名称：处理get Http请求
 * 日期：2016-11-07
 * 描述：处理react-router 并且返回对应的容器组件
 */

//加载依赖
import { AppRegistry } from 'react-native'
import ReactDOMServer from 'react-dom/server';
import { getRoutejs } from 'code-spliter-router';

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
        this.reactApplication = reactApplication;
        this.splitRoutes = reactApplication.splitRoutes
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
        this.doReactResponse();
    }

    /**
     * 获取同构代码拆分路由js,如果不存在拆分js则返回null
     */
    getSplitRouteJs() {
        return getRoutejs(this.currentRequest.path, '/app/');
    }

    /**
     * 执行React同构直出
     */
    doReactResponse() {
        try {
            let { reactRunAppName, reactAppContext } = this.reactApplication;
            let { element, stylesheet } = AppRegistry.getApplication(reactRunAppName);
            let initialHTML = ReactDOMServer.renderToString(element)
            let clientReactAppContext = Object.assign({}, reactAppContext);
            clientReactAppContext.route = clientReactAppContext.route.routeName;
            //调用视图引擎返回页面
            let options = {
                title: (reactAppContext.route.title || 'React native for Web'),
                initialHTML: initialHTML,
                stylesheet: stylesheet,
                splitRouteJs: this.getSplitRouteJs(),
                reactAppContext: JSON.stringify(clientReactAppContext)
            };
            this.currentResponse.status(200).render('react', options);
        } catch (ex) {
            this.nextPiple(ex);
        }
    }
}
