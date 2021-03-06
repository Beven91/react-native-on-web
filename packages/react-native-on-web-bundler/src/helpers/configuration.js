/**
 * 名称：打包配置工具
 * 日期：2017-05-19
 * 描述: 读取自定义打包配置文件
 */
let path = require('path');
let fse = require('fs-extra');
let logger = require('./logger');

let cacheConfiguration = null;

function Configuration() {
  this.print();
  let configPath = Configuration.configPath;
  let config = this.config = fse.existsSync(configPath) ? require(configPath) : {};
  config.releaseDir = config.releaseDir || Configuration.releaseDir || path.resolve('release/react-web');
  config.projectRoot = config.projectRoot || process.cwd();
  this.check(config, configPath);
  this.mergeStatic(config);
  this.mergeIgnores(config);
  this.mergeLocalConfig(config);
}

/**
 * 附加异常输出
 */
Configuration.prototype.print = function () {
  process.on('uncaughtException', function (e) {
    e.onlyMessage ? logger.error(e.message) : logger.error(e.stack);
    process.exit(1);
  });
};

/**
 * 校验必要参数
 */
Configuration.prototype.check = function (config, configPath) {
  // this.emptyOf(config.releaseDir, '打包目标目录参数(releaseDir) 必须设置')
  // this.emptyOf(config.projectRoot, '工程根目录参数(projectRoot) 必须设置');
  // this.emptyOf(config.serverContextEntry, '服务端entry(serverContextEntry) 必须设置');
  // this.emptyOf(config.clientContextEntry, '客户端打包entry(clientContextEntry) 必须设置');
};

/**
 * 配置配置对象
 */
Configuration.get = function (refresh) {
  if (refresh) {
    let configPath = Configuration.configPath;
    let rootRc = path.resolve('.bundlerc.js');
    delete require.cache[require.resolve(configPath)];
    if (fse.existsSync(rootRc)) {
      delete require.cache[require.resolve(rootRc)];
    }
    cacheConfiguration = new Configuration();
  }
  if (!cacheConfiguration) {
    cacheConfiguration = new Configuration();
  }
  return cacheConfiguration.config || {};
};

/**
 * 强制刷新配置
 */
Configuration.session = function (configPath, releaseDir, refresh) {
  this.configPath = configPath;
  this.releaseDir = releaseDir;
  cacheConfiguration = null;
  return Configuration.get(refresh);
};

/**
 * 合并本地配置文件
 */
Configuration.prototype.mergeLocalConfig = function (config) {
  if (config.serverContextEntry) {
    let entry = path.dirname(config.serverContextEntry);
    let babelrc = path.join(entry, '.babelrc');
    let webpack = path.join(entry, 'webpack.js');
    if (this.useOf(config.babelrc, babelrc)) {
      config.babelrc = fse.readJsonSync(babelrc);
      let presets = config.babelrc.presets || [];
      config.babelrc.presets = presets.filter(function (p) {
        return p !== 'react-native';
      });
    }
    if (this.useOf(config.webpack, webpack)) {
      config.webpack = require(webpack);
    }
  }
};

/**
 * 静态资源扩展名处理函数
 */
Configuration.prototype.mergeStatic = function (config) {
  let staticHandle = config.static;
  config.static = typeof staticHandle === 'function' ? staticHandle : defaultHandle;
};


/**
 * 合并ignore
 */
Configuration.prototype.mergeIgnores = function (config) {
  let file = path.join(config.projectRoot, '.gitignore');
  let content = fse.existsSync(file) ? String(fse.readFileSync(file)) : '';
  let lines = content.split('\n');
  let ignores = lines.map(function (line) {
    return line.trim().replace(/\t/g, '');
  });
  config.ignores = config.ignores || [];
  config.ignores = config.ignores.concat(ignores);
  config.ignores.push('.happypack/**/*');
  config.ignores.push('.git/**/*');
};

/**
 * 是否使用本地配置
 */
Configuration.prototype.useOf = function (obj, file) {
  return (obj == null || Object.keys(obj).length <= 0) && fse.existsSync(file);
};

/**
 * 判断制定对象是否为null或者空字符串,如果满足条件则抛出异常
 */
Configuration.prototype.emptyOf = function (v, message) {
  let isEmpty = v === null || v === undefined || v.toString().replace(/\s/g, '') === '';
  this.throws(isEmpty, message);
};

/**
 * 表达式结果输出控制
 * @paaram {Boolean} r 结果 如果为false时不进行异常抛出，否则抛出指定消息的异常
 * @param {String} message 当r为false时 抛出的异常消息
 */
Configuration.prototype.throws = function (r, message) {
  if (r) {
    let error = new Error(message);
    error.onlyMessage = true;
    throw error;
  }
};

function defaultHandle(extensions) {
  return extensions;
}

module.exports = Configuration;
