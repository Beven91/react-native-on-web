/**
 * 名称：创建一个react-native web工程
 * 日期：2017-04-05
 * 作者：Beven
 */

// 引入依赖>>
var path = require('path')
var fse = require('fs-extra')
var logger = require('../logger.js')
var Npm = require('../helpers/npm.js');

/**
 * 工程生成工具 构造函数
 */
function ReactNativeWeb (options) {
  this.initialize(options)
}

/**
 * 初始化生成工具
 */
ReactNativeWeb.prototype.initialize = function (options) {
  logger.info('ReactNativeOnWeb: init web platform please wait ...')
  // 初始化上下文参数
  this.initContext(options)
  this.copyProject()
  this.copyIndexWeb();
  this.install();
  logger.info('ReactNativeOnWeb: web platform (created)')
  logger.info('ReactNativeOnWeb: you can invoke   < react-native-on-web start >   start the web platform')
}

/**
 * 初始化上下文参数
 */
ReactNativeWeb.prototype.initContext = function (options) {
  this.projectRoot = path.join(__dirname, '..', 'tmpl', 'project')
  this.targetProjectRoot = path.join(process.cwd(), 'web')
}

/**
 * 复制project
 */
ReactNativeWeb.prototype.copyProject = function () {
  if (fse.existsSync(this.targetProjectRoot)) {
    logger.info('ReactNativeOnWeb: web directory is existsed')
  }else {
    logger.info('ReactNativeOnWeb: make web project ...')
    fse.copySync(this.projectRoot, this.targetProjectRoot)
    logger.info('ReactNativeOnWeb: make web project successful !')
  }
}

/**
 * 复制index.web.js
 */
ReactNativeWeb.prototype.copyIndexWeb = function () {
  var indexWeb = path.join(this.targetProjectRoot, '..', 'index.web.js')
  if (!fse.existsSync(indexWeb)) {
    fse.copySync(path.join(this.projectRoot, '..', 'index.web.js'), indexWeb)
    logger.info('ReactNativeOnWeb: make index.web.js successful !')
  }
}

/**
 * 安装依赖
 */
ReactNativeWeb.prototype.install  =function(){
  logger.info('ReactNativeOnWeb: init web ...')
  new Npm(path.join(this.targetProjectRoot,'..')).install('json-loader image-web-loader babel-loader file-loader url-loader --save-dev');
  new Npm(this.targetProjectRoot).run('init');
}

/**
 * 公布任务执行函数
 */
module.exports = function (options) {
  return new ReactNativeWeb(options)
}
