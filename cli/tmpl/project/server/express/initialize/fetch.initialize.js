/**
 * 名称：fetch跨域支持
 * 日期：2017-05-19
 * 描述：提供客户端浏览器发起请求跨域配置
 */

// 引入依赖>>
import appContext from 'app-context'
import logger from 'logger'
import ProxyPool from '../../framework/proxy/proxypool.js'

const VARORIGINURL = '___originurl__'
// 获取express app对象
const app = appContext.getParam('app')
// 创建代理池
const proxyPool = new ProxyPool(10)

app.use('/fetch', (req, resp, next) => {
  let proxyUrl = req.headers[VARORIGINURL];
  req.baseUrl = proxyUrl;
  req.originalUrl = proxyUrl;
  req.url = proxyUrl;
  proxyPool
    .createProxy(proxyUrl)
    .then((proxy) => {
       proxy.web(req, resp, {}, (ex, a, b, c) => next(ex));
    })
    .catch((ex) => {
      logger.error(ex)
      next('请求异常')
    })
})
