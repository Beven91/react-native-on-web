/**
 * 名称：异常处理中间件
 * 日期：2016-11-25
 * 描述：在这里根据错误，进行页面跳转处理，注意，该中间件请放置在app.use最后
 */

//引入依赖>>
import appContext from 'app-context';
import logger from 'logger';

class ErrorHandler {

    /**
     * 组件构造函数
     */
    constructor(err, req, resp, next) {
        this.onRequest(err, req, resp, next);
    }

    /**
     * 中间件处理
     */
    onRequest(err, req, resp, next) {
        return this.do500Reponse(err, req, resp, next);
    }

    /**
     * 执行500返回
     */
    do500Reponse(err, req, resp, next) {
        resp.status(500).render('shared/500', {
            title: '页面出错啦...',
            message: appContext.valueOf(`<div class='message'><span class='error-icon'>ERROR</span><code>${err.stack}</code></div>`, ''),
        });
        logger.error(err.stack);
    }
}

module.exports = (err, req, resp, next) => new ErrorHandler(err, req, resp, next);