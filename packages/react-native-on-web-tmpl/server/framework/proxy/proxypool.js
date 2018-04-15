/**
 * 名称：代理池
 * 日期：2017-05-19
 * 描述：维护一个http代理池
 */

//引入依赖>>
import urlParser from 'url'
import httpProxy from 'http-proxy'
import { EventEmitter } from 'dantejs'

const VARTIMER = '@proxy_clean_timer@'
const VARUSING = '@proxy_is_using@'
const CLEANTIME = 2 * 60 * 1000

export default class ProxyPool {
  /**
   * 代理池构造函数
   * @param {Number} max 代理池最大容量 
   */
  constructor(max = 10) {
    this.max = max
    this.pool = {}
    this.emitter = new EventEmitter()
  }

  /**
   * 创建一个数据代理
   */
  createProxy(url) {
    return new Promise((resolve, reject) => {
      if (this.isCongestion) {
        this.clean()
        return this.emitter.on('wait', () => resolve(this.createProxy(url)))
      }
      let target = this.proxyTarget(url)
      let proxyOptions = {
        target: target,
        changeOrigin: true
      }
      let proxy = this.pool[target]
      if (!proxy) {
        this.pool[target] = proxy = httpProxy.createProxyServer(proxyOptions)
        proxy.on('error', () => this.onEndProxy(proxy))
        proxy.on('proxyReq', () => this.onStartProxy(proxy))
        proxy.on('proxyRes', () => this.onEndProxy(proxy))
      }
      resolve(proxy)
    })
  }

  /**
   * 开始代理请求
   */
  onStartProxy(proxy) {
    clearTimeout(proxy[VARTIMER])
    proxy.isUsing = true;
  }

  /**
   * 当请求结束
   */
  onEndProxy(proxy) {
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
  proxyTarget(url) {
    let uri = urlParser.parse(url)
    return `${uri.protocol}//${uri.host}`
  }

  /**
   * 当前代理池是否拥堵
   */
  get isCongestion() {
    return this.length >= this.max
  }

  /**
   * 获取当前代理池的长度
   */
  get length() {
    return Object.keys(this.pool).length
  }

  /**
   * 自动清理无用的代理
   */
  clean() {
    let keys = Object.keys(this.pool)
    let notUseKeys = keys.filter((key) => !this.pool[key].isUsing)
    notUseKeys.forEach((key) => this.pool[key] = null)
    this.emitter.emit('wait')
  }
}