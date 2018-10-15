/**
 * 名称：实现require静态资源加载
 * 日期：2017-04-05
 * 描述：使服务端nodejs支持静态资源文件加载
 */

// 引入依赖>>
let fs = require('fs');
let path = require('path');
let dantejs = require('dantejs');
let urlloader = require('url-loader');
let imageloader = require('image-web-loader');

// 全局配置
let config = require('../rnw-config.js')();
let webpack = require('../webpack/webpack.client');
// 基础路径
let publicPath = config.publicPath;
let serverResolves = config.serverResolves;

let rules = webpack.module.rules || [];
let imageRule = { test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg)$/ };
rules.filter(function (r) {
  let loaders = dantejs.Array.ensureArray(r.loaders || r.loader);
  return loaders.filter(function (loader) {
    let name = (dantejs.Type.isString(loader) ? loader : loader.loader || '');
    if (name === 'image-web-loader') {
      imageRule = r;
    }
  }).length > 0;
});

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
  let buffer = fs.readFileSync(filename);
  let context = getContext(filename, '?limit=1');
  let exp = urlloader.call(context, buffer);
  let fn = new Function('module,__webpack_public_path__', exp);
  fn(md, publicPath);
}

/**
 * 图片resolve
 */
function imgResolve(md, filename) {
  let buffer = fs.readFileSync(filename);
  let context = getContext(filename, {});
  let context2 = getContext(filename, '?limit=1');
  let content = urlloader.call(context2, buffer);
  let exp = imageloader.sync.call(context, content);
  let fn = new Function('module,__webpack_public_path__', exp);
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
    emitWarning: function (message) {
      console.warn(message);
    },
  };
}

/**
 * 空处理模块加载函数
 */
function unKnowResolve(md, filename) {
  md.exports = {};
}

require.extensions['.css'] = unKnowResolve;

// 批量注册静态资源加载器
config.static.map(function (ext) {
  (!require.extensions[ext]) && (require.extensions[ext] = moduleResolve);
});


Object.keys(serverResolves).forEach(function (ext) {
  let handle = serverResolves[ext];
  require.extensions['.' + ext] = function (md, file) {
    md.exports = handle(file);
  };
});
