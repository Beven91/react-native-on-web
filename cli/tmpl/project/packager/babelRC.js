/**
 * 名称：服务端node代码babel代码编译配置
 * 日期：2017-05-09
 */

var path = require('path')
var fse = require('fs-extra')

// node_modules下需要编译的es6模块
// 注意：数组项必须为正则表达式
var es6NodeModules = [
  /react-native-/
]

module.exports.getRC = function () {
  return {
    presets: ['react-native'],
    ignore: function (file) {
      var isNodeModules = /node_modules/.test(file)
      return (isNodeModules && !isNodeModuleCompile(file))
    },
    compact: true,
    plugins: [
      [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
        'mode': 'wrap'
      }]
    ],
    extensions: ['.js', '.web.js']
  }
}

//是否node_modules需要webpack打包编译
module.exports.isNodeModuleCompile = isNodeModuleCompile;

function isNodeModuleCompile (file) {
  var regexp = null
  var isCompile = false
  file = file.split('node_modules')[1] || ''
  for (var i = 0,k = es6NodeModules.length;i < k;i++) {
    regexp = es6NodeModules[i]
    if (regexp.test(file)) {
      isCompile = true
      break
    }
  }
  return isCompile
}
