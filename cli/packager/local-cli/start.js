/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

//依赖>>：
var path = require('path');
var yargs = require('yargs')
var fse = require('fs-extra');
var logger = require('../../logger.js')
var Npm = require('../../helpers/npm.js')
var Configuration = require('./config.js');

var argv = process.title === 'npm' ? JSON.parse(process.env.npm_config_argv).original.concat(process.argv.slice(3)) : process.argv;

// 定义用例
yargs.usage('\nUsage: react-native-on-web --releaseDir=targetdir').help()

// 配置参数类型
yargs.options({
  'releaseDir': {
    type: 'string',
    alias: 't',
    describe: 'release assets target dir'
  },
  'client': {
    type: 'string',
    alias: 'c',
    describe: 'release client side code'
  },
  'server': {
    type: 'string',
    alias: 's',
    describe: 'release server side code'
  },
  'install': {
    type: 'string',
    alias: 'i',
    defalt: false,
    describe: 'release after use npm install build node_modules'
  }
})

// // 解析参数
yargs.parse(argv)

if (argv.length <= 2) {
  return yargs.showHelp();
}

var config = yargs.argv;

if (!path.isAbsolute(config.releaseDir)) {
  config.releaseDir = path.join(process.cwd(), config.releaseDir);
}

//判断发布目录是否存在，如果存在 则修改发布目录为 config.releaseDir/react-web
config.releaseDir = path.join(config.releaseDir || '', 'react-web');

//设置install值
config.install = config.install !== undefined && config.install !== false;

//安装配置
Configuration.session(config);

//模式判定 如果在没有传递--server 或者--client时 默认同时打包服务端客户端
if (config.client === undefined && config.server === undefined) {
  config.client = config.server = true;
}

//如果是完全打包，则发布前执行删除发布目录
if (config.server && config.client) {
  logger.info('ReactNativeOnWeb: Remove dir:' + config.releaseDir);
  fse.removeSync(config.releaseDir);
}

var env = { NODE_ENV: 'production' }

//执行服务端打包
function serverPack() {
  var sp = { status: 0 };
  if (config.server != null) {
    logger.info('\nReactNativeOnWeb: Bundle server side .......');
    sp = (new Npm()).node('node_modules/webpack/bin/webpack.js', [
      '--colors',
      '--config',
      path.join(__dirname, '..', '..', 'packager/webpack/webpack.server.js')
    ], env);
  }
  return sp.status == 0;
}

//执行客户端端打包
function clientPack() {
  var sp = { status: 0 };
  if (config.client != null) {
    logger.info('\nReactNativeOnWeb: Bundle client side .......');
    sp = (new Npm()).node('node_modules/webpack/bin/webpack.js', [
      '--colors',
      '--config',
      path.join(__dirname, '..', '..', 'packager/webpack/webpack.client.js')
    ], env);
  }
  return sp.status == 0;
}

//构建node_modules
function nodeModulesPack() {
  var sp = { status: 0 };
  if (config.install) {
    logger.info('\nReactNativeOnWeb: use npm install build node_mdoules ...........');
    sp = (new Npm(config.releaseDir)).install('--production');
  }
  return sp.status == 0;
}

//执行构建流程
function runAppPack() {
  var handle = null;
  var packs = Array.prototype.slice.call(arguments);
  for (var i = 0, k = packs.length; i < k; i++) {
    handle = packs[i];
    if (!handle()) {
      logger.info('\n\nReactNativeOnWeb:  Bundle error.....');
      return;
    }
  }
  //如果采用npm install模式 构建发布后的node_modules
  logger.info('\n\nReactNativeOnWeb:  Bundle complete!');
}

//执行构建
runAppPack(serverPack, clientPack, nodeModulesPack);




