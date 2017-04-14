/**
 * 名称：浏览器fetch
 * 日期：2016-11-09
 * 描述：用于提供浏览器端fetch
 */

import "whatwg-fetch";

import initFetch from "./wrap-fetch.js";

module.exports = initFetch(self.fetch);