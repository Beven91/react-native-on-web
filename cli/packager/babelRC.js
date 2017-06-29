/**
 * 名称：服务端node代码babel代码编译配置
 * 日期：2017-05-09
 */

var path = require('path')
var fse = require('fs-extra')
var dependencyTree = require('dependency-tree');

var file = path.resolve('.packager.js')
var packager = fse.existsSync(file) ? require(file) : {}

var babelrc = packager.babelrc || {};

// node_modules下需要编译的es6模块
// 注意：数组项必须为正则表达式
var es6NodeModules = [
  /react-native-/
].concat((packager.es6Modules || []))

//设置根据配置选择是默认所有文件都是用babel编译还是开启白名单方式
//compileAll 会导致开发环境启动变慢，生产不影响
var ignore = packager.compileAll ? /node_modules[/\\](babel-|regenerator-transform|happypack|babel|webpack)/ : isCompileIgnore

module.exports.getRC = function (indexWeb) {
  initReactNativeCompileNodeModules(indexWeb);
  return {
    presets: [require.resolve('babel-preset-react-native')].concat(babelrc.presets || []),
    ignore: ignore,
    babelrc: false,
    compact: true,
    plugins: [
      [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
        'mode': 'wrap'
      }]
    ].concat(babelrc.plugins || []),
    extensions: ['.web.js', '.js'].concat(babelrc.extensions || [])
  }
}

// 是否node_modules需要webpack打包编译
module.exports.isNodeModuleCompile = isNodeModuleCompile;

/**
 * 初始化项目需要编译成es6的node_modules模块
 * @param {*} indexWebEntry 
 */
var initReactNativeCompileNodeModules = function (indexWebEntry) {
  if (packager.compileAll) {
    var modules = dependencyTree.toList({
      filename: indexWebEntry,
      directory: path.dirname(indexWebEntry)
    });
    modules.forEach(function (key) {
      var lastIndex = key.lastIndexOf("node_modules");
      var moduleName = key.substring(lastIndex).split(path.sep)[1];
      es6NodeModules.push(new RegExp(moduleName));
    })
  }
  initReactNativeCompileNodeModules = function () { }
}

function isCompileIgnore(jsfile) {
  var isNodeModules = /node_modules/.test(jsfile)
  return (isNodeModules && !isNodeModuleCompile(jsfile))
}

function isNodeModuleCompile(jsfile) {
  var regexp = null
  var isCompile = false
  jsfile = jsfile.indexOf('node_modules') > -1 ? jsfile.split('node_modules')[1] : jsfile
  for (var i = 0, k = es6NodeModules.length; i < k; i++) {
    regexp = es6NodeModules[i]
    if (jsfile.indexOf('react-native-on-web') < 0 && regexp.test(jsfile)) {
      isCompile = true
      break
    }
  }
  return isCompile
}
