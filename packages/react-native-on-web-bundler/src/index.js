/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */
//依赖>>：
var path = require('path');
var fse = require('fs-extra');
var logger = require('./helpers/logger')
var Npm = require('npm-shell');
var Options = require('./helpers/options');
var Configuration = require('./helpers/configuration')

var env = { NODE_ENV: 'production' }

//执行服务端打包
function serverPack() {
  logger.info('Bundle server side .......');
  var sp = (new Npm()).node('node_modules/webpack/bin/webpack.js', [
    '--colors',
    '--config',
    path.join(__dirname, '/webpack/webpack.server.js')
  ], Options.assign(env, process.env));
  return sp.status === 0;
}

//执行客户端端打包
function clientPack() {
  logger.info('Bundle client side .......');
  var sp = (new Npm()).node('node_modules/webpack/bin/webpack.js', [
    '--colors',
    '--config',
    path.join(__dirname, '/webpack/webpack.client.js')
  ], Options.assign(env, process.env));
  return sp.status === 0;
}

//清除发布目录
function cleanPack(context) {
  var config = require(context.configPath);
  //如果是完全打包，则发布前执行删除发布目录
  if (context.client && context.server) {
    logger.info('Remove dir:' + config.releaseDir);
    fse.removeSync(config.releaseDir || context.releaseDir);
  }
  return true;
}

//执行构建流程
function runAppPack(packs, context) {
  var handle = null;
  for (var i = 0, k = packs.length; i < k; i++) {
    handle = packs[i];
    if (!handle(context)) {
      return logger.error('Bundle error.....');
    }
  }
  //如果采用npm install模式 构建发布后的node_modules
  logger.info('Bundle complete!');
}

/**
 * 打包入口函数
 * @param {String} configPath 自定义配置文件路径 默认会识别process.cwd()/.packager.js
 * @param {Boolean} client 是否打包客户端
 * @param {Boolean} server 是否打包服务端
 * @param {String} releaseDir 发布目标目录
 *                （可以从configPath配置文件中指定，或者使用本参数)
 *                优先级：configPath优先级高于本参数
 */
function runPack(configPath, client, server, releaseDir) {
  var handlers = [cleanPack];
  if (client) {
    handlers.push(clientPack);
  }
  if (server) {
    handlers.push(serverPack);
  }
  releaseDir = path.join(releaseDir, 'react-web');
  //设置打包配置文件环境变量
  Configuration.session(configPath, releaseDir)
  var context = {
    releaseDir: releaseDir,
    configPath: configPath,
    client: client,
    server: server
  }
  runAppPack(handlers, context);
}

process.on('uncaughtException', function (e) {
  logger.error(e.stack);
  process.exit(1);
});

module.exports = {
  runPack: runPack,
  Options: Options
}



