/**
 * 名称：fetch包裹工具
 * 日期：2016-11-09
 * 描述：包裹fetch 设置baseUrl
 */

class FetchWrapper {

    /**
     * 构造函数
     */
    constructor(fetch) {
        this.originFetch = fetch;
        this.initGlobal();
    }

    /**
     * 强制初始化全局对象
     */
    initGlobal() {
        let fetch = this.originFetch;
        if (typeof global == 'undefined') {
            window.global = window;
        }
        global.fetch = this.fetch.bind(this);
        global.Response = fetch.Response;
        global.Headers = fetch.Headers;
        global.Request = fetch.Request;
    }

    /**
     * 发起请求
     */
    fetch(url, params) {
        url = (global.fetchBaseUri || "") + url;
        var fetch = this.originFetch;
        return fetch(url, params);
    }

}

module.exports = (fetch) => {
    let wrapper = new FetchWrapper(fetch);
    return global.fetch;
}