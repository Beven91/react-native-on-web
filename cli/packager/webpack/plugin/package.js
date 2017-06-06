/***
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra')
var path = require('path')
var minimatch = require('minimatch')
var Npm = require('../../../helpers/npm.js')

// 配置文件
var config = require('../../config.js')
// babel 配置
var babelRc = require('../../babelRC.js').getRC()
// .babelrc 文件路径
var babelrcfile = path.resolve('.babelrc')

/**
 * 发布后处理插件
 */
function ReleasePackageJson (outputOptions) {
  this.outputOptions = outputOptions
}

/**
 * 复制相关文件
 */
ReleasePackageJson.prototype.copyAssets = function () {
  var fromDir = config.rootDir
  var targetDir = config.releaseDir
  var ignores = config.ignores || []
  fse.copySync(fromDir, targetDir, {filter: function (src, dest) {
      var isDir = fse.lstatSync(src).isDirectory();
      var relName = path.relative(fromDir,src);
      relName =isDir?relName+"/*":relName;
      for (var i = 0,k = ignores.length;i < k;i++) {
        if (minimatch(relName,ignores[i],{matchBase:true,dot:true,nocase:true})) {
          return false
        }
      }
      return true
  }})
}

/**
 * 发布结尾处理
 */
ReleasePackageJson.prototype.make = function () {
  this.compile()
  this.configPackage()
  this.configWeb()
  this.configIndex()
}

/**
 * 编译server目录es6
 */
ReleasePackageJson.prototype.compile = function () {
  try {
    this.writeBabelRc()
    var r = (new Npm()).exec('babel', [
      path.join(config.rootDir, 'server'),
      '-D',
      '-q',
      '--out-dir=' + path.join(config.releaseDir, 'server')
    ])
  }catch(ex){
    console.error(ex);
  }finally {
    this.removeBabelRc()
  }
}

/**
 * 移除babelrc文件
 */
ReleasePackageJson.prototype.removeBabelRc = function () {
  if (fse.existsSync(babelrcfile)) {
    fse.removeSync(babelrcfile)
  }
}

/**
 * 写出临时.babelrc文件
 */
ReleasePackageJson.prototype.writeBabelRc = function () {
  var config = {
    'presets': babelRc.presets,
    'plugins': [
      ['module-resolver', {
        'alias': {
          'react-native-on-web/cli/packager/register': 'react-native-on-web/empty',
          'react-native-on-web/cli/packager/webpack/middleware/hot.bundle.js': 'react-native-on-web/empty'
        }
      }]
    ]
  }
  fse.writeJSONSync(babelrcfile, config)
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
  var outputOptions = this.outputOptions
  var dir = path.dirname(outputOptions.filename)
  var originIndexWeb = webConfig.indexWeb
  var targetIndexWeb = path.join(outputOptions.path, dir, path.basename(originIndexWeb))
  webConfig.port = 8080
  webConfig.indexWeb = path.relative(path.join(config.releaseDir), targetIndexWeb)
  webConfig.version = new Date().getTime()
  this.writeJson(outfile, webConfig)
}

/**
 * 覆写server/index.js
 */
ReleasePackageJson.prototype.configIndex = function () {
  var releaseDir = config.releaseDir
  var file = path.join(releaseDir, 'server/index.js')
  var outfile = path.join(releaseDir, 'server/index.js')
  var indexContent = fse.readFileSync(file).toString()
  var indexRequire = '(' + this.targetRequireAlias.toString() + ')()'
  indexContent = indexRequire + indexContent
  fse.copySync(path.join(__dirname, '../../alias.js'), path.join(releaseDir, 'server/alias.js'))
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
  var maker = new ReleasePackageJson(compiler.options.output)
  compiler.plugin('done', function (compilation) {
    maker.make()
  })
  compiler.plugin('emit', function (compilation, callback) {
    maker.copyAssets()
    callback()
  })
}

module.exports = PackageJsonPlugin
