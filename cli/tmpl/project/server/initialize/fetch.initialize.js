/**
 * 名称：fetch跨域支持
 * 日期：2017-05-19
 * 描述：提供客户端浏览器发起请求跨域配置
 */

// 引入依赖>>
import express from 'express'
import appContext from 'app-context'
import logger from 'logger'
import urlParser from 'url'
import httpProxy from 'http-proxy'
import {EventEmitter2} from 'eventemitter2';

// 获取express app对象
const app = appContext.getParam('app')

const VARTIMER = '@proxy_clean_timer@'

const VARUSING = '@proxy_is_using@'

const CLEANTIME = 2 * 60 * 1000

/**
 * 代理池
 */
class ProxyPool {
  /**
   * 代理池构造函数
   * @param {Number} max 代理池最大容量 
   */
  constructor (max = 10) {
    this.max = max
    this.pool = {}
    this.emitter = new EventEmitter2()
  }

  /**
   * 创建一个数据代理
   */
  createProxy (url) {
    return new Promise((resolve, reject) => {
      if (this.isCongestion) {
        this.clean()
        return this.emitter.on('wait', () => resolve(this.createProxy(url)))
      }
      let target = this.proxyTarget(url)
      let proxyOptions = {
        target: target,
        changeOrigin:true
      }
      let proxy = this.pool[target]
      if (!proxy) {
        this.pool[target] = proxy = httpProxy.createProxyServer(proxyOptions)
        proxy.on('error', () => this.onEndProxy(proxy))
        proxy.on('proxyReq', () => this.onEndProxy(proxy))
        proxy.on('proxyRes', () => this.onStartProxy(proxy))
      }
      resolve(proxy)
    })
  }

  /**
   * 开始代理请求
   */
  onStartProxy (proxy) {
    clearTimeout(proxy[VARTIMER])
  }

  /**
   * 当请求结束
   */
  onEndProxy (proxy) {
    // 等待2秒执行清楚
    proxy[VARTIMER] = setTimeout(() => {
      proxy[VARUSING] = false
      this.clean()
    }, CLEANTIME)
  }

  /**
   * 根据url获取对应的代理target
   * @param {String} url 
   */
  proxyTarget (url) {
    let uri = urlParser.parse(url)
    let port = uri.port ? ':' + uri.port : ''
    return `${uri.protocol}//${uri.host}${port}`
  }

  /**
   * 当前代理池是否拥堵
   */
  get isCongestion () {
    return this.length >= this.max
  }

  /**
   * 获取当前代理池的长度
   */
  get length () {
    return Object.keys(this.pool).length
  }

  /**
   * 自动清理无用的代理
   */
  clean () {
    let keys = Object.keys(this.pool)
    let notUseKeys = keys.filter((key) => !this.pool[key].isUsing)
    notUseKeys.forEach((key) => this.pool[key] = null)
    this.emitter.emit('wait')
  }

}

// 创建代理池
const proxyPool = new ProxyPool(10)

app.use('/fetch', (req, resp, next) => {
  let proxyUrl = req.headers['___originurl__']
  proxyPool
    .createProxy(proxyUrl)
    .then((proxy) => {
      proxy.web(req, resp, {}, (ex, a, b, c) => next(ex))
    })
    .catch((ex) => {
      logger.error(ex)
      next('请求异常')
    })
})
