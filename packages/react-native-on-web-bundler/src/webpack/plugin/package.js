/***
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra')
var path = require('path')
var logger = require('../../helpers/logger');
var Options = require('../../helpers/options')

// 配置文件
var config = require('../../rnw-config.js')();

/**
 * 发布后处理插件
 */
function ReleasePackageJson(outputOptions) {
  this.outputOptions = outputOptions
}

/**
 * 发布结尾处理
 */
ReleasePackageJson.prototype.make = function () {
  this.configPackage()
  this.configWeb()
}

/**
 * 配置发布后的package.json
 */
ReleasePackageJson.prototype.configPackage = function () {
  logger.debug("Config package")
  var releaseDir = config.releaseDir
  var pgk = require(path.resolve('package.json'))
  var pgkfile = path.join(releaseDir, 'package.json')
  var indexWebPackageFile = path.join(path.dirname(config.serverContextEntry), 'package.json');
  var indexWebPackage = fse.existsSync(indexWebPackageFile) ? require(indexWebPackageFile) : {};
  var topLevelDeps = indexWebPackage.dependencies || {};
  pgk.dependencies = Options.assign(topLevelDeps, pgk.dependencies);
  delete pgk.dependencies['react-native'];
  delete pgk.devDependencies
  pgk.scripts = {
    'init': 'npm install --registry=https://registry.npm.taobao.org',
    'pm2': 'pm2 start pm2.json',
    'start': 'cross-env NODE_ENV=production node ./www/index.js'
  }
  this.writeJson(pgkfile, pgk)
}

/**
 * 配置web.json
 * 修改启动端口
 * 修改资源版本号为当前时间
 */
ReleasePackageJson.prototype.configWeb = function () {
  var file = path.resolve('web.json')
  if (fse.existsSync(file)) {
    logger.debug("Config web")
    var outfile = path.join(config.releaseDir, 'web.json')
    var webConfig = fse.readJsonSync(file)
    var outputOptions = this.outputOptions
    var dir = path.dirname(outputOptions.filename)
    var originIndexWeb = webConfig.indexWeb
    var targetIndexWeb = path.join(outputOptions.path, dir, path.basename(originIndexWeb))
    if (config.targetPort) {
      webConfig.port = config.targetPort;
    }
    webConfig.indexWeb = path.relative(path.join(config.releaseDir), targetIndexWeb)
    webConfig.version = new Date().getTime()
    this.writeJson(outfile, webConfig)
  }
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

function PackageJsonPlugin() {
}

PackageJsonPlugin.prototype.apply = function (compiler) {
  var maker = new ReleasePackageJson(compiler.options.output)
  compiler.plugin('done', function (compilation) {
    maker.make()
  })
}

module.exports = PackageJsonPlugin
