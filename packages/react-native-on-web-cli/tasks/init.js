/**
 * 名称：创建一个react-native web工程
 * 日期：2017-04-05
 * 作者：Beven
 */

// 引入依赖>>
let path = require('path');
let fse = require('fs-extra');
let logger = require('../logger.js');
let Npm = require('npm-shell');

/**
 * 工程生成工具 构造函数
 */
function ReactNativeWeb(options) {
  this.initialize(options);
}

/**
 * 初始化生成工具
 */
ReactNativeWeb.prototype.initialize = function (options) {
  logger.info('ReactNativeOnWeb: init web platform please wait ...');
  // 初始化上下文参数
  this.initContext(options);
  this.copyProject();
  this.copyIndexWeb();
  this.updatePackage();
  this.updateWebConfig();
  this.install();
  logger.info('ReactNativeOnWeb: web platform (created)');
  logger.info('ReactNativeOnWeb: you can invoke   < react-native-on-web start >   start the web platform');
};

/**
 * 初始化上下文参数
 */
ReactNativeWeb.prototype.initContext = function (options) {
  let cwd = process.cwd();
  let pgkPath = path.join(cwd, 'package.json');
  let pgk = fse.existsSync(pgkPath) ? require(pgkPath) : {};
  let dependencies = pgk.dependencies || {};
  this.inReactNativeProject = !!dependencies['react-native'];
  this.projectRoot = path.dirname(path.dirname(require.resolve('react-native-on-web-tmpl')));
  this.targetProjectRoot = this.inReactNativeProject ? path.join(cwd, 'web') : cwd;
};

/**
 * 复制project
 */
ReactNativeWeb.prototype.copyProject = function () {
  let file = path.join(this.targetProjectRoot, 'package.json');
  if (fse.existsSync(file)) {
    logger.info('ReactNativeOnWeb: web platform is existsed');
  } else {
    logger.info('ReactNativeOnWeb: make web project ...');
    fse.copySync(this.projectRoot, this.targetProjectRoot);
    logger.info('ReactNativeOnWeb: make web project successful !');
  }
};

/**
 * 复制index.web.js
 */
ReactNativeWeb.prototype.copyIndexWeb = function () {
  if (this.inReactNativeProject) {
    let indexWeb = path.join(this.targetProjectRoot, '..', 'index.web.js');
    if (!fse.existsSync(indexWeb)) {
      fse.copySync(path.join(this.projectRoot, 'index.web.js'), indexWeb);
      logger.info('ReactNativeOnWeb: make index.web.js successful !');
    }
    fse.removeSync(path.join(this.targetProjectRoot, 'index.web.js'));
    fse.moveSync(path.join(this.targetProjectRoot, '.gitignore.keep'), path.join(this.targetProjectRoot, '.gitignore'));
  }
};

/**
 * 修改package.json
 */
ReactNativeWeb.prototype.updatePackage = function () {
  let file = path.join(this.targetProjectRoot, 'package.json');
  let bak = file + '.bak';
  if (fse.existsSync(bak)) {
    fse.moveSync(bak, file, { overwrite: true });
    fse.removeSync(bak);
  }
  if (fse.existsSync(file)) {
    let pgk = fse.readJsonSync(file);
    pgk.name = 'web';
    pgk.version = '1.0.0';
    fse.removeSync(file);
    fse.writeJsonSync(path.join(this.targetProjectRoot, 'package.json'), pgk);
  }
};

/**
 * 更新web.json
 */
ReactNativeWeb.prototype.updateWebConfig = function () {
  let file = path.join(this.targetProjectRoot, 'web.json');
  if (fse.existsSync(file) && this.inReactNativeProject) {
    let config = require(file);
    config.indexWeb = '../index.web.js';
    fse.writeJsonSync(file, config);
  }
};

/**
 * 安装依赖
 */
ReactNativeWeb.prototype.install = function () {
  logger.info('ReactNativeOnWeb: init web ...');
  new Npm(this.targetProjectRoot).install();
  if (fse.existsSync(path.join(this.targetProjectRoot, '..', 'package.json'))) {
    new Npm(path.join(this.targetProjectRoot, '..')).install();
  }
};

/**
 * 公布任务执行函数
 */
module.exports = function (options) {
  return new ReactNativeWeb(options);
};
