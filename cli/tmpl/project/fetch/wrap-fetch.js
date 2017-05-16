/**
 * 名称：fetch包裹工具
 * 日期：2016-11-09
 * 描述：包裹fetch 设置baseUrl
 */

module.exports = (fetch) => {
  if (typeof global == 'undefined') {
    window.global = window
  }
  const myfetch = (url, ...others) => {
    url = /^(http:|https:)/.test(url.trim()) ? (global.fetch.baseUri || '') + url : url
    return fetch(url, ...others)
  }
  global.fetch = myfetch
  global.Response = myfetch.Response = fetch.Response
  global.Headers = myfetch.Headers = fetch.Headers
  global.Request = myfetch.Request = fetch.Request
  return global.fetch
}
