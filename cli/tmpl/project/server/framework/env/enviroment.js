/**
 * 名称：M站站点环境
 * 日志：2016-11-02
 * 描述：用于判断当前环境,以及在不同环境进行适配
 */

// 引用依赖>>
var fse = require('fs-extra')
var path = require('path')

// 环境顺序
var envOrders = ['development', 'production']

var runAppVariableName = '@@__reactRunApplicationName__@@';

/**
 * 环境适配类
 */
function AppContext () {
  // 初始化环境
  var env = this.env = process.env.NODE_ENV || 'development'
  this.isPro = env == 'production'
  this.isDev = env == 'development'
  this.context = {
    web: fse.readJsonSync(path.resolve('web.json'))
  }
  this.envIndex = envOrders.indexOf(env)
}

/**
 * 环境适配表达式
 * @param env 环境类型 例如： development 
 * @param handler 表达式函数，当在env与当前应用程序的环境一致时触发
 */
AppContext.prototype.on = function (env, handler) {
  if (env == this.env) {
    if (typeof handler == 'function') {
      return handler()
    } else {
      return handler
    }
  }
}

/**
 * 设置react runApplication 名称
 * @param name 使用AppRegistry的app名称
 */
AppContext.prototype.setRunReactAppName = function(name){
  this[runAppVariableName] = name;
}

/**
 * 获取react runApplication 名称
 */
AppContext.prototype.getRunReactAppName = function(name){
  return this[runAppVariableName];
}

/**
 * 当环境为生产环境时触发
 * @param handler 表达式函数 当当前环境为production时触发
 */
AppContext.prototype.onPro = function (handler) {
  return this.on('production', handler)
}

/**
 * 当环境为开发环境时触发
 * @param handler 表达式函数 当当前环境为development时触发
 */
AppContext.prototype.onDev = function (handler) {
  return this.on('development', handler)
}

/**
 * 环境取值，根据当前环境返回对应传入参数的值
 * @param ....args
 * 参数顺序:'development's value,'production's value
 */
AppContext.prototype.valueOf = function (development, production) {
  var values = Array.prototype.slice.call(arguments, 0, arguments.length)
  return values[this.envIndex]
}

/**
 * 设置环境参数
 * @param name 参数名
 * @param value 参数值
 */
AppContext.prototype.setParam = function (name, value) {
  this.context[name] = value
}

/**
 * 获取指定参数
 * @param name 参数名
 * @param dv 默认参数值
 */
AppContext.prototype.getParam = function (name, dv) {
  return this.context[name] || dv
}

/**
 * 获取服务所在机器的ip地址
 */
AppContext.prototype.getLocalIP = function () {
  let ipv4
  let os = require('os')
  let networks = os.networkInterfaces()
  let keys = Object.keys(networks)
  let network = networks[keys[0]]
  for (let i = 0; i < network.length; i++) {
    let networkItem = network[i]
    if (networkItem.family == 'IPv4') {
      ipv4 = networkItem.address
      break
    }
  }
  return ipv4
}

// 公布实例为exports
module.exports = new AppContext()
