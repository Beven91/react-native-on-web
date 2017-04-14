/**
 * 名称：React-Native Web别名模块加载器
 * 日期：2017-04-05
 * 描述：用于实现开发环境将具体的模块使用别名模块进行引用
 */

// 原始require
var originRequire = module.constructor.prototype.require
// 获取webpack配置
var webpack = require('../webpack/webpack.client.js')

// 别名模块
var ReactNativeWebAlias = webpack.resolve.alias || {
  'react-native': 'react-native-on-web'
}

/**
 * 重写require  添加别名处理
 */
module.constructor.prototype.require = function (name) {
  var id = ReactNativeWebAlias[name] || name
  return originRequire.call(this, id)
}
