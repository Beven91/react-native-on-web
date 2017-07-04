/**
 * 名称：代码拆分配置工具
 * 日期:2017-07-04
 * 描述：用于配置webpack进行代码拆分的工具，实现拆分后不影响react同构
 */

var path = require('path');
var fse = require('fs-extra');
var url = require('url');
var querystring = require('querystring');

var PAGES = 'pages/';
var CONFIGFILE = path.resolve('spliter.json');

function CodeSpliter(rootDir, spliters, babelRc) {
  this.rootDir = rootDir;
  this.points = spliters || [];
  this.babelRc = babelRc;
  this.routes = {};
}

/**
 * 获取所有拆分点
 */
CodeSpliter.prototype.split = function () {
  var spliters = this.points.map(this.createSpliter.bind(this));
  spliters = spliters.filter(function (v) { return v !== null; });
  this.save();
  return spliters;
}

/**
 * 创建一个拆分点
 */
CodeSpliter.prototype.createSpliter = function (point) {
  var route = querystring.parse(url.parse(point).query);
  var src = (point.split('?')[0] || '').trim();
  var name = (route.name || '').replace(/\//, '.');
  if (src.indexOf('index=') === 0) {
    this.index = src.split('index=')[1];
    return null;
  }
  var file = path.isAbsolute(src) ? src : path.join(this.rootDir, src)
  name = name ? name : file.split(path.sep).slice(-3).join('.');
  name = PAGES + name.toLowerCase() + '.js';
  if (route.name) {
    this.routes[route.name.replace(/(^\/|\/$)/g, '')] = name;
  }
  return {
    test: /\.js$|\.jsx$/,
    include: file,
    use: [
      {
        loader: 'bundle-loader',
        options: {
          lazy: true,
          name: './' + name
        }
      },
      {
        loader: 'babel-loader',
        options: {
          presets: this.babelRc.presets,
          plugins: this.babelRc.plugins
        }
      }
    ],
  }
}

/**
 * 输出拆分配置
 */
CodeSpliter.prototype.save = function () {
  if (this.index) {
    this.routes[''] = this.routes[this.index];
  }
  fse.writeJSONSync(CONFIGFILE, this.routes);
}

module.exports = CodeSpliter;
