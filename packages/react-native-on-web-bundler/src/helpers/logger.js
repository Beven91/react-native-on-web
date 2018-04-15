/**
 * 名称：辅助日志输出工具
 * 日期：2017-03-17
 * 作者：Beven
 * 描述：
 */
var chalk = require('chalk');

/**
 * 日志构造函数
 */
function Logger() {
  this.levels = { 'error': true, 'info': true, debug: false }
}

/**
 * 当输入表达式为true时回引发异常
 * @param express {Boolean} true/false 
 * @param message {String} 在异常情况下需要输出的消息
 */
Logger.prototype.throwif = function (express, message) {
  if (express) {
    throw new Error(message)
  }
}

/**
 * 输出一个info日志
 *  @param message 消息模板
 * @param ...params 其他参数
 */
Logger.prototype.info = function (message) {
  if (this.isLevel('info')) {
    message = chalk.green('\nReactNativeOnWeb ' + message);
    return console.info.apply(console, arguments)
  }
}

/**
 * 输出一个调试日志
 */
Logger.prototype.debug = function (message) {
  if (this.isLevel('debug')) {
    message = chalk.green('\nReactNativeOnWeb ' + message);
    return console.debug.apply(console, arguments)
  }
}

/**
 * 输出一个error日志
 *  @param message 消息模板
 * @param ...params 其他参数
 */
Logger.prototype.error = function (message) {
  if (this.isLevel('error')) {
    message = (message && typeof message === 'object') ? message.stack : message;
    message = chalk.bgRed('\nReactNativeOnWeb ' + message);
    return console.error.apply(console, arguments)
  }
}

/**
 * 输出一个error日志
 *  @param message 消息模板
 * @param ...params 其他参数
 */
Logger.prototype.warn = function (message) {
  message = (message && typeof message === 'object') ? message.stack : message;
  message = chalk.yellow('\nReactNativeOnWeb ' + message);
  return console.error.apply(console, arguments)
}


/**
 * 设置日志等级
 */
Logger.prototype.setLevel = function (level) {
  this.levels[(level || '').toLowerCase()] = true
}

/**
 * 是否可以输出指定等级日志
 */
Logger.prototype.isLevel = function (level) {
  return this.levels[level]
}

// 公布日志对象
module.exports = new Logger()
