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
var Options = require('./helpers/options');
var Configuration = require('./helpers/configuration')

//执行服务端打包
function serverPack(context, callback) {
  logger.info('Bundle server side .......');
  process.env['NODE_ENV'] = 'production';
  var webpack = require('webpack');
  var compiler = webpack(require('./webpack/webpack.server'));
  compiler.run(function (err, context) {
    if (err) {
      return logger.error(err.stack);
    } else if (context.hasErrors()) {
      const stats = context.toJson();
      return logger.error(stats.errors.join('\n'));
    }
    callback();
  })
}

//执行客户端端打包
function clientPack(context, callback) {
  logger.info('Bundle client side .......');
  process.env['NODE_ENV'] = 'production';
  var webpack = require('webpack');
  var compiler = webpack(require('./webpack/webpack.client'));
  compiler.run(function (err, context) {
    if (err) {
      return logger.error(err.stack);
    } else if (context.hasErrors()) {
      const stats = context.toJson();
      return logger.error(stats.errors.join('\n'));
    }
    callback();
  })
}

//清除发布目录
function cleanPack(context, callback) {
  var config = require(context.configPath);
  //如果是完全打包，则发布前执行删除发布目录
  if (context.client && context.server) {
    logger.info('Remove dir:' + config.releaseDir);
    fse.removeSync(config.releaseDir || context.releaseDir);
  }
  callback();
}

//执行构建流程
function runAppPack(packs, context) {
  try {
    packs.reverse().reduce(function (previous, current) {
      return function () { current(context, previous); }
    }, function () {
      logger.info('Bundle complete!');
    })();
  } catch (ex) {
    logger.error(ex.stack);
    logger.error('Bundle error.....');
    logger.info('Bundle complete!');
  }
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
  releaseDir = path.isAbsolute(releaseDir) ? releaseDir : path.resolve(releaseDir);
  releaseDir = path.join(releaseDir, 'react-web');
  //设置打包配置文件环境变量
  var config = Configuration.session(configPath, releaseDir)
  server = config.isomorphic ? server : false;
  if (client) {
    handlers.push(clientPack);
  }
  if (server) {
    handlers.push(serverPack);
  }
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