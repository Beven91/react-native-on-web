/**
 * 名称：服务端node代码babel代码编译配置
 * 日期：2017-05-09
 */

var path = require('path')
var fse = require('fs-extra')

var file = path.resolve('.packager.js')
var packager = fse.existsSync(file) ? require(file) : {}

// node_modules下需要编译的es6模块
// 注意：数组项必须为正则表达式
var es6NodeModules = [
  /react-native-/
].concat((packager.es6Modules || []))

//设置根据配置选择是默认所有文件都是用babel编译还是开启白名单方式
//compileAll 会导致开发环境启动变慢，生产不影响
var ignore = packager.compileAll ? /node_modules[/\\](babel-|regenerator-transform|babel)/ : isCompileIgnore

module.exports.getRC = function () {
  return {
    presets: [require.resolve('babel-preset-react-native')],
    ignore: ignore,
    babelrc: false,
    compact: true,
    plugins: [
      [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
        'mode': 'wrap'
      }]
    ],
    extensions: ['.js', '.web.js']
  }
}

// 是否node_modules需要webpack打包编译
//module.exports.isNodeModuleCompile =isNodeModuleCompile;

function isCompileIgnore (file) {
  var isNodeModules = /node_modules/.test(file)
  return (isNodeModules && !isNodeModuleCompile(file))
}

function isNodeModuleCompile (file) {
  var regexp = null
  var isCompile = false
  file = file.indexOf('node_modules') > -1 ? file.split('node_modules')[1] : file
  for (var i = 0,k = es6NodeModules.length;i < k;i++) {
    regexp = es6NodeModules[i]
    if (file.indexOf('react-native-on-web') < 0 && regexp.test(file)) {
      isCompile = true
      break
    }
  }
  return isCompile
}
