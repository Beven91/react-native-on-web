/***
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra')
var path = require('path')
var minimatch = require('minimatch')
var logger = require('../../helpers/logger');
var Options = require('../../helpers/options')
var Npm = require('npm-shell')

// 配置文件
var config = require('../../rnw-config.js')
// babel 配置
var babelRc = require('../../babelRC.js').babelRc;
// .babelrc 文件路径
var babelrcfile = path.join(config.projectRoot, '.babelrc')

/**
 * 发布后处理插件
 */
function ReleasePackageJson(outputOptions) {
  this.outputOptions = outputOptions
}

/**
 * 复制相关文件
 */
ReleasePackageJson.prototype.copyAssets = function () {
  var fromDir = config.projectRoot
  var targetDir = config.releaseDir
  var ignores = config.ignores || []
  fse.copySync(fromDir, targetDir, {
    filter: function (src, dest) {
      var isDir = fse.lstatSync(src).isDirectory();
      var relName = path.relative(fromDir, src);
      relName = isDir ? relName + '/*' : relName;
      for (var i = 0, k = ignores.length; i < k; i++) {
        if (src.indexOf(targetDir) > -1) {
          return false;
        }
        if (minimatch(relName, ignores[i], { matchBase: true, dot: true, nocase: true })) {
          return false
        }
      }
      return true
    }
  })
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
    logger.info("Compile server.......")
    this.writeBabelRc()
    var npm = new Npm();
    npm.exec('babel', [
      path.join(config.projectRoot, 'server'),
      '-D',
      '-q',
      '--out-dir=' + path.join(config.releaseDir, 'server')
    ])
  } catch (ex) {
    logger.error(ex)
  } finally {
    logger.info("Compile server complete")
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
  var rcConfig = {
    'presets': babelRc.presets,
    'plugins': [
      ['module-resolver', {
        'alias': {
          'react-native-on-web/packager/register': 'react-native-on-web/provider',
          'react-native-on-web/packager/hot.bundle.js': 'react-native-on-web/packager/bundle.js'
        }
      }]
    ]
  }
  fse.writeJSONSync(babelrcfile, rcConfig)
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
 * 覆写server/index.js
 */
ReleasePackageJson.prototype.configIndex = function () {
  var releaseDir = config.releaseDir
  var file = path.join(releaseDir, 'www/index.js')
  if (fse.existsSync(file)) {
    logger.debug("Config alias")
    var outfile = path.join(releaseDir, 'www/index.js')
    var indexContent = fse.readFileSync(file).toString()
    var indexRequire = '(' + this.targetRequireAlias.toString() + ')()'
    indexContent = indexRequire + indexContent
    this.write(outfile, indexContent)
    this.configAlias();
  }
}

/**
 * 创建别名
 */
ReleasePackageJson.prototype.configAlias = function () {
  var releaseDir = config.releaseDir
  var projectRoot = config.projectRoot;
  var alias = config.alias;
  var keys = Object.keys(alias);
  var aliasCode = [];
  var newAlias = [];
  aliasCode.push('var path = require(\'path\');');
  aliasCode.push('var webConfig = require(path.resolve(\'web.json\'));');
  aliasCode.push('module.exports = {');
  keys.forEach(function (key) {
    var moduleName = alias[key];
    var resolve = (moduleName.split(projectRoot)[1] || '').replace(/^(\\|\/)/, '').replace(/\\/g, '/');
    moduleName = path.isAbsolute(moduleName) ? 'path.resolve(\'' + resolve + '\')' : '\'' + moduleName + '\'';
    moduleName = key === 'react-native-on-web-index-web-js' ? 'path.resolve(webConfig.indexWeb)' : moduleName;
    newAlias.push('\'' + key + '\':' + moduleName);
  });
  aliasCode.push(newAlias.join(',\n'));
  aliasCode.push('}');
  fse.writeFileSync(path.join(releaseDir, 'www/alias.js'), aliasCode.join('\n'));
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

function PackageJsonPlugin() {
}

PackageJsonPlugin.prototype.apply = function (compiler) {
  var maker = new ReleasePackageJson(compiler.options.output)
  compiler.plugin('done', function (compilation) {
    maker.make()
  })
  compiler.plugin('emit', function (compilation, callback) {
    logger.debug("Copy assets......")
    maker.copyAssets()
    logger.debug("Copy assets complete")
    callback()
  })
}

module.exports = PackageJsonPlugin
