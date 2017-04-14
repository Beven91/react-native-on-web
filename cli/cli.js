/**
 * 名称：react-native-on-web 工程构建工具
 * 日期：2017-04-05
 * 作者：Beven
 * 描述：用于生成一个标准的模板react-native web平台工程
 */

// 引入依赖>>
var path = require('path')
var fse = require('fs-extra')
var logger = require('./logger.js')
var Npm = require('./helpers/npm.js');

// 构建任务黑名单
var blackList = ['run']

/**
 * CLI 构造函数
 */
function ReactNativeOnWebCli () {
}

/**
 * 返回一个调用ReactNativeOnWebCli指定任务的函数
 * @param name  要返回的任务名称
 */
ReactNativeOnWebCli.prototype.run = function (name) {
  if (blackList.indexOf(name) > -1) {
    throw new Error(name + ' is not suported')
  }
  var handler = this[name]
  if (typeof handler == 'function') {
    return handler.bind(this)
  } else {
    throw new Error(name + ' is not suported')
  }
}

/**
 * 在react-native目录下生成一个react-native web工程 
 */
ReactNativeOnWebCli.prototype.initReactWeb = function () {
  // 生成工程
  require('./tasks/init.js')()
}

/**
 * 启动web 
 */
ReactNativeOnWebCli.prototype.start = function () {
  var runRoot = process.cwd()
  var projectRoot = path.join(runRoot, 'web')
  if (!fse.existsSync(projectRoot)) {
    return logger.error('ReactNativeOnWeb: there has not web platform you can invoke <react-native-on-web init> to create web platform')
  }else {
    new Npm(projectRoot).run('start');
  }
}

/**
 * 删除web工程
 */
ReactNativeOnWebCli.prototype.remove = function () {
  var runRoot = process.cwd()
  var projectRoot = path.join(runRoot, 'web')
  var indexWeb = path.join(projectRoot, '..', 'index.web.js')
  logger.error('ReactNativeOnWeb: remove web platform ......')
  if (fse.existsSync(projectRoot)) {
    fse.removeSync(projectRoot)
  }
  if (fse.existsSync(indexWeb)) {
    fse.removeSync(indexWeb)
  }
  logger.error('ReactNativeOnWeb: remove web platform successful!')
}

// 公布cli
module.exports = new ReactNativeOnWebCli()
