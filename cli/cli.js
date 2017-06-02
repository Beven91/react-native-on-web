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
var Npm = require('./helpers/npm.js')
var pgk = require('../package.json')

// 构建任务黑名单
var blackList = ['run']
var runRoot = process.cwd()
var projectRoot = path.join(runRoot, 'web')

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
  if (hasWebPlatform()) {
    new Npm(projectRoot).run('start')
  }
}

/**
 * 删除web工程
 */
ReactNativeOnWebCli.prototype.remove = function () {
  if (hasWebPlatform()) {
    var indexWeb = path.join(projectRoot, '..', 'index.web.js')
    logger.info('ReactNativeOnWeb: remove web platform ......')
    if (fse.existsSync(projectRoot)) {
      fse.removeSync(projectRoot)
    }
    if (fse.existsSync(indexWeb)) {
      fse.removeSync(indexWeb)
    }
    logger.info('ReactNativeOnWeb: remove web platform successful!')
  }
}

/**
 * 打包发布
 */
ReactNativeOnWebCli.prototype.bundle = function () {
  if (hasWebPlatform()) {
    logger.info('ReactNativeOnWeb: Running bundle .......')
    var argv = process.argv.slice(3)
    new Npm(runRoot).node('./packager/local-cli/start.js', argv, projectRoot)
  }
}

function hasWebPlatform () {
  var packageJsonPath = path.join(projectRoot, 'package.json')
  var dependencies = fse.existsSync(packageJsonPath) ? Object.keys(require(packageJsonPath).dependencies) : []
  var hasPlatform = (fse.existsSync(projectRoot) && dependencies.indexOf(pgk.name) > -1)
  if (!hasPlatform) {
    logger.error('ReactNativeOnWeb: there has not web platform you can invoke <react-native-on-web init> to create web platform')
  }
  return hasPlatform
}

// 公布cli
module.exports = new ReactNativeOnWebCli()
