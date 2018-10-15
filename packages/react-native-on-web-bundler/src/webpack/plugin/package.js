/** *
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
let fse = require('fs-extra');
let path = require('path');
let logger = require('../../helpers/logger');
let Options = require('../../helpers/options');

// 配置文件
let config = require('../../rnw-config.js')();

/**
 * 发布后处理插件
 */
function ReleasePackageJson(outputOptions) {
  this.outputOptions = outputOptions;
}

/**
 * 发布结尾处理
 */
ReleasePackageJson.prototype.make = function () {
  this.configPackage();
  this.configWeb();
};

/**
 * 配置发布后的package.json
 */
ReleasePackageJson.prototype.configPackage = function () {
  logger.debug('Config package');
  let releaseDir = config.releaseDir;
  let pgk = require(path.resolve('package.json'));
  let pgkfile = path.join(releaseDir, 'package.json');
  let nodeBundlName = 'node_modules/react-native-on-web/packager/webpack/';
  let nodeBundle = path.resolve(nodeBundlName);
  let targetNodeBundle = path.join(releaseDir, nodeBundlName);
  let indexWebPackageFile = path.join(path.dirname(config.serverContextEntry), 'package.json');
  let indexWebPackage = fse.existsSync(indexWebPackageFile) ? require(indexWebPackageFile) : {};
  let topLevelDeps = indexWebPackage.dependencies || {};
  pgk.dependencies = Options.assign(topLevelDeps, pgk.dependencies);
  delete pgk.dependencies['react-native'];
  delete pgk.devDependencies;
  Object.keys(pgk.dependencies).forEach(function (k) {
    pgk.dependencies[k] = pgk.dependencies[k].replace(/(\^|~)/, '');
  });
  pgk.scripts = {
    'init': 'npm install --registry=https://registry.npm.taobao.org',
    'pm2': 'pm2 start pm2.json',
    'start': 'cross-env NODE_ENV=production node ./www/index.js',
  };
  this.writeJson(pgkfile, pgk);
  fse.copySync((nodeBundle), targetNodeBundle);
};

/**
 * 配置web.json
 * 修改启动端口
 * 修改资源版本号为当前时间
 */
ReleasePackageJson.prototype.configWeb = function () {
  let file = path.resolve('web.json');
  if (fse.existsSync(file)) {
    logger.debug('Config web');
    let outfile = path.join(config.releaseDir, 'web.json');
    let webConfig = fse.readJsonSync(file);
    let outputOptions = this.outputOptions;
    let dir = path.dirname(outputOptions.filename);
    let originIndexWeb = webConfig.indexWeb;
    let targetIndexWeb = path.join(outputOptions.path, dir, path.basename(originIndexWeb));
    if (config.targetPort) {
      webConfig.port = config.targetPort;
    }
    webConfig.indexWeb = path.relative(path.join(config.releaseDir), targetIndexWeb);
    webConfig.version = new Date().getTime();
    this.writeJson(outfile, webConfig);
  }
};

/**
 * 写出json文件
 * @param file 文件路径
 * @param content 文件内容
 */
ReleasePackageJson.prototype.writeJson = function (file, content) {
  fse.ensureDirSync(path.dirname(file));
  fse.writeFileSync(file, JSON.stringify(content, null, 2));
};

function PackageJsonPlugin() {
}

PackageJsonPlugin.prototype.apply = function (compiler) {
  let maker = new ReleasePackageJson(compiler.options.output);
  compiler.plugin('done', function () {
    maker.make();
  });
};

module.exports = PackageJsonPlugin;
