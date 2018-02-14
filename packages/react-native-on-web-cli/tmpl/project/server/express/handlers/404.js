/**
 * 名称：404处理中间件
 * 日期：2016-11-25
 * 描述：处理站点404
 */

//引入依赖>>
class NotfoundHandler {

    /**
     * 组件构造函数
     */
    constructor(req, resp, next) {
        this.onRequest(req, resp, next);
    }

    /**
     * 中间件处理
     */
    onRequest(req, resp, next) {
        return this.do404Response(req, resp, next);
    }

    /**
     * 执行404返回
     */
    do404Response(req, resp, next) {
        resp.status(404).render('shared/404', {
            title: '找不到页面...',
        });
    }
}

module.exports = (req, resp, next) => new NotfoundHandler(req, resp, next);