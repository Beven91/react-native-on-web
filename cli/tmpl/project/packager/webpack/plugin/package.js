/***
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra')
var path = require('path')
var dantejs = require('dantejs')

// 配置文件
var config = require('../../config.js')

/**
 * 发布后处理插件
 */
function ReleasePackageJson () {}

/**
 * 发布结尾处理
 */
ReleasePackageJson.prototype.make = function () {
  this.configPackage()
  this.configWeb()
  this.configIndex()
}

/**
 * 配置发布后的package.json
 */
ReleasePackageJson.prototype.configPackage = function () {
  var releaseDir = config.releaseDir
  var pgk = require(path.resolve('package.json'))
  var pgkfile = path.join(releaseDir, 'package.json')
  delete pgk.devDependencies
  pgk.scripts = {
    'init': 'npm install --registry=https://registry.npm.taobao.org',
    'pm2': 'pm2 start pm2.json',
    'start': 'cross-env NODE_ENV=production node ./server/index.js'
  }
  this.writeJson(pgkfile, pgk)
}

/**
 * 配置web.json
 * 修改启动端口为80
 * 修改资源版本号为当前时间
 */
ReleasePackageJson.prototype.configWeb = function () {
  var file = path.resolve('web.json')
  var outfile = path.join(config.releaseDir, 'web.json')
  var webConfig = fse.readJsonSync(file)
  webConfig.port = 8080
  webConfig.version = new Date().getTime()
  this.writeJson(outfile, webConfig)
}

/**
 * 覆写server/index.js
 */
ReleasePackageJson.prototype.configIndex = function () {
  var file = path.resolve('server/index.js')
  var releaseDir = config.releaseDir
  var outfile = path.join(releaseDir, 'server/index.js')
  var indexContent = fse.readFileSync(file).toString()
  var indexRequire = '(' + this.targetRequireAlias.toString() + ')()'
  indexContent = indexContent.replace("require('../packager/register/');", indexRequire)
  fse.copySync(path.resolve('packager/alias.js'), path.join(releaseDir, 'server/alias.js'))
  this.write(outfile, indexContent)
}

/**
 * 写出文件
 * @param file 文件路径
 * @param content 文件内容
 */
ReleasePackageJson.prototype.write = function (file, content) {
  fse.ensureDirSync(path.dirname(file))
  fse.writeFile(file, content)
}

/**
 * 写出json文件
 * @param file 文件路径
 * @param content 文件内容
 */
ReleasePackageJson.prototype.writeJson = function (file, content) {
  fse.ensureDirSync(path.dirname(file))
  fse.writeJSONSync(file, content)
}

/**
 * 别名模板函数
 */
ReleasePackageJson.prototype.targetRequireAlias = function () {
  var alias = require('./alias.js')
  var originRequire = module.constructor.prototype.require
  module.constructor.prototype.require = function (name) {
    var id = alias[name] || name
    return originRequire.call(this, id)
  }
}

function PackageJsonPlugin () {
}

PackageJsonPlugin.prototype.apply = function (compiler) {
  compiler.plugin('after-emit', function (compilation, callback) {
    var maker = new ReleasePackageJson()
    maker.make()
    callback();
  })
}

module.exports = PackageJsonPlugin
