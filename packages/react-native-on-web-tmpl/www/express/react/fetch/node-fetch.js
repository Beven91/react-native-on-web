/**
 * 名称：node服务器fetch
 * 日期：2016-11-09
 * 描述：用于提供node端fetch
 */

import fetch from 'node-fetch';

export default require('./wrap-fetch.js')(fetch);
