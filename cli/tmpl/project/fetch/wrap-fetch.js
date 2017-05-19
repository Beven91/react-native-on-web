/**
 * 名称：fetch包裹工具
 * 日期：2016-11-09
 * 描述：包裹fetch 设置baseUrl
 */

module.exports = (fetch, proxy) => {
  if (typeof global == 'undefined') {
    window.global = window
  }
  const myfetch = (url, config) => {
    url = /^(http:|https:)/.test(url.trim()) ? (global.fetch.baseUri || '') + url : url
    if (proxy) {
      config = config || {}
      config.headers = config.headers || {}
      config.headers['___originUrl__'] = url
      return fetch('/fetch', config)
    }else {
      return fetch(url, config)
    }
  }
  global.fetch = myfetch
  global.Response = myfetch.Response = fetch.Response
  global.Headers = myfetch.Headers = fetch.Headers
  global.Request = myfetch.Request = fetch.Request
  return global.fetch
}
