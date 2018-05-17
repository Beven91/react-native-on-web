/**
 * 名称：实现require静态资源加载
 * 日期：2017-04-05
 * 描述：使服务端nodejs支持静态资源文件加载
 */

//引入依赖>>
var fs = require('fs');
var path = require('path');
var dantejs = require('dantejs');
var urlloader = require('url-loader');
var imageloader = require('image-web-loader');

//全局配置
var config = require('../rnw-config.js')();
var webpack = require('../webpack/webpack.client');
//基础路径
var publicPath = config.publicPath;
var serverResolves = config.serverResolves;

var rules = webpack.module.rules || [];
var imageRule = { test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg)$/ };
rules.filter(function (r) {
  var loaders = dantejs.Array.ensureArray(r.loaders || r.loader);
  return loaders.filter(function (loader) {
    var name = (dantejs.Type.isString(loader) ? loader : loader.loader || '');
    if (name === 'image-web-loader') {
      imageRule = r;
    }
  }).length > 0;
})

/**
 * 模块resolve
 * @param {Module} md 
 * @param {*} filename 
 */
function moduleResolve(md, filename) {
  const ext = path.extname(filename);
  if (imageRule.test.test(ext)) {
    return imgResolve(md, filename);
  } else {
    return fileResolver(md, filename);
  }
}

/**
 * 扩展require.extensions url-loader 的require实现
 * @param md require的module 对象
 * @param filename require的module 对应的文件物理路径
 */
function fileResolver(md, filename) {
  var buffer = fs.readFileSync(filename);
  var context = getContext(filename, '?limit=1');
  var exp = urlloader.call(context, buffer);
  var fn = new Function('module,__webpack_public_path__', exp);
  fn(md, publicPath);
}

/**
 * 图片resolve
 */
function imgResolve(md, filename) {
  var context = getContext(filename,{});
  var exp = imageloader.sync.call(context,'');
  var fn = new Function('module,__webpack_public_path__', exp);
  fn(md, publicPath);
}

/**
 * 创建一个loaderContext
 */
function getContext(filename, query, options) {
  return {
    resourcePath: filename,
    query: query,
    options: webpack,
    emitFile: function () { },
    emitWarning: function (message) { console.warn(message) }
  };
}

/**
 * 空处理模块加载函数
 */
function unKnowResolve(md, filename) {
  md.exports = {};
}

require.extensions['.css'] = unKnowResolve;

//批量注册静态资源加载器
config.static.map(function (ext) { (!require.extensions[ext]) && (require.extensions[ext] = moduleResolve); });


Object.keys(serverResolves).forEach(function (ext) {
  var handle = serverResolves[ext];
  require.extensions['.' + ext] = function (md, file) {
    md.exports = handle(file);
  }
})
