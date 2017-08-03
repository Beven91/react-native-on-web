/**
 * 名称：辅助日志输出工具
 * 日期：2017-03-17
 * 作者：Beven
 * 描述：
 */

/**
 * 日志构造函数
 */
function StackLogger() {
  this.levels = { 'error': true, 'info': true }
}

/**
 * 当输入表达式为true时回引发异常
 * @param express {Boolean} true/false 
 * @param message {String} 在异常情况下需要输出的消息
 */
StackLogger.prototype.throwif = function (express, message) {
  if (express) {
    throw new Error(message)
  }
}

/**
 * 输出消息
 * @param message 消息模板
 * @param ...params 其他参数
 */
StackLogger.prototype.log = function (message) {
  return console.log.apply(console, this.formatArgs(arguments))
}

/**
 * 输出一个info日志
 *  @param message 消息模板
 * @param ...params 其他参数
 */
StackLogger.prototype.info = function (message) {
  if (this.isLevel('info')) {
    return console.info.apply(console, this.formatArgs(arguments))
  }
}

/**
 * 输出一个error日志
 *  @param message 消息模板
 * @param ...params 其他参数
 */
StackLogger.prototype.error = function (message) {
  if (this.isLevel('error')) {
    return console.error.apply(console, this.formatArgs(arguments))
  }
}

/**
 * 统一格式化格式
 */
StackLogger.prototype.format = function (message) {
  return message
}

/**
 * 设置日志等级
 */
StackLogger.prototype.setLevel = function (level) {
  this.levels[(level || '').toLowerCase()] = true
}

/**
 * 是否可以输出指定等级日志
 */
StackLogger.prototype.isLevel = function (level) {
  return this.levels[level]
}

/**
 * 格式化绑定
 */
StackLogger.prototype.formatArgs = function (args) {
  args[0] = this.format(args[0])
  return args
}

// 公布日志对象
module.exports = new StackLogger()
