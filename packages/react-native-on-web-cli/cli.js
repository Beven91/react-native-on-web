/**
 * 名称：react-native-on-web 工程构建工具
 * 日期：2017-04-05
 * 作者：Beven
 * 描述：用于生成一个标准的模板react-native web平台工程
 */

// 引入依赖>>
let path = require('path');
let fse = require('fs-extra');
let logger = require('./logger.js');
let Npm = require('npm-shell');

// 构建任务黑名单
let blackList = ['run'];
let runRoot = process.cwd();
let projectRoot = hasPackageReactOnWeb(runRoot) ? runRoot : path.join(runRoot, 'web');

/**
 * CLI 构造函数
 */
function ReactNativeOnWebCli() {
}

/**
 * 返回一个调用ReactNativeOnWebCli指定任务的函数
 * @param name  要返回的任务名称
 */
ReactNativeOnWebCli.prototype.run = function (name) {
  if (blackList.indexOf(name) > -1) {
    throw new Error(name + ' is not suported');
  }
  let handler = this[name];
  if (typeof handler === 'function') {
    return handler.bind(this);
  } else {
    throw new Error(name + ' is not suported');
  }
};

/**
 * 在react-native目录下生成一个react-native web工程
 */
ReactNativeOnWebCli.prototype.initReactWeb = function () {
  // 生成工程
  require('./tasks/init.js')();
};

/**
 * 启动web
 */
ReactNativeOnWebCli.prototype.start = function () {
  if (!hasWebPlatform()) {
    return;
  }
  if (!fse.existsSync(path.join(projectRoot, 'node_modules'))) {
    new Npm(projectRoot).install();
  }
  new Npm(projectRoot).run('start');
};

/**
 * 删除web工程
 */
ReactNativeOnWebCli.prototype.remove = function () {
  if (hasWebPlatform()) {
    let indexWeb = path.join(projectRoot, '..', 'index.web.js');
    logger.info('ReactNativeOnWeb: remove web platform ......');
    if (fse.existsSync(projectRoot)) {
      fse.removeSync(projectRoot);
    }
    if (fse.existsSync(indexWeb)) {
      fse.removeSync(indexWeb);
    }
    logger.info('ReactNativeOnWeb: remove web platform successful!');
  }
};

/**
 * 打包发布
 */
ReactNativeOnWebCli.prototype.bundle = function (releaseDir, mode) {
  if (hasWebPlatform()) {
    logger.info('ReactNativeOnWeb: Running bundle .......');
    let selfRoot = path.join(__dirname, 'tmpl', 'project', 'web');
    let inProject = selfRoot.indexOf(projectRoot) > -1;
    let pack = path.join(projectRoot, 'node_modules/react-native-on-web/packager/index.js');
    if (projectRoot === selfRoot || inProject) {
      pack = path.join(__dirname, '../packager/index.js');
    }
    let argv = process.argv.slice(3);
    new Npm(projectRoot).node(pack, argv, { NODE_ENV: 'production' });
  }
};

/**
 * 升级react-native-on-web
 */
ReactNativeOnWebCli.prototype.upgrade = function () {
  if (hasWebPlatform()) {
    logger.info('ReactNativeOnWeb: Starting update .......');
    let npm = new Npm(projectRoot);
    logger.info('ReactNativeOnWeb: update react-native-on-web module .....');
    npm.unInstall('react-native-on-web');
    npm.install('react-native-on-web --save');
    npm.install('react-native-on-web-cli --save');
    let file = path.join(projectRoot, '.packager.js');
    if (fse.existsSync(file)) {
      let bundlerc = String(fse.readFileSync(file));
      let entry = bundlerc.clientContextEntry || '';
      bundlerc.clientContextEntry = entry.replace('server/express/react', 'www/express/react');
    }
    // logger.info('ReactNativeOnWeb: update global react-native-on-web module .....');
    // npm.install('react-native-on-web -g');
    logger.info('ReactNativeOnWeb: update complete ');
  }
};

function hasWebPlatform() {
  let hasPlatform = hasPackageReactOnWeb(runRoot) || hasPackageReactOnWeb(projectRoot);
  if (!hasPlatform) {
    logger.error('ReactNativeOnWeb: there has not web platform you can invoke <react-native-on-web init> to create web platform');
  }
  return hasPlatform;
}

function hasPackageReactOnWeb(dir) {
  let packageJsonPath = path.join(dir, 'package.json');
  let dependencies = fse.existsSync(packageJsonPath) ? Object.keys(require(packageJsonPath).dependencies || {}) : [];
  return dependencies.indexOf('react-native-on-web') > -1;
}

// 公布cli
module.exports = new ReactNativeOnWebCli();
