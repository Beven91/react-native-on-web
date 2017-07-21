/**
 * 名称：服务端node代码babel代码编译配置
 * 日期：2017-05-09
 */

var combine = require('../helpers/combine.js');
var Configuration = require('./local-cli/config.js')

var packager = Configuration.get().customConfig
var allCompile = packager.compileAll;
var IGNORE_EXP = /node_modules[/\\](babel-|regenerator-transform|happypack|babel|webpack)/;
// node_modules下需要编译的es6模块
// 注意：数组项必须为正则表达式
var MODULES_REG = [
  /react-native-/
].concat((packager.es6Modules || []))

module.exports = {
  babelRc: combine({
    presets: [require.resolve('babel-preset-react-native')],
    ignore: exclude,
    babelrc: false,
    compact: true,
    plugins: [
      [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
        'mode': 'wrap'
      }]
    ],
    extensions: ['.web.js', '.js']
  }, packager.babelrc),
  exclude: exclude,
  include2: include
}

function exclude(js) {
  var inNodeModules = /node_modules/.test(js)
  return (inNodeModules && !include(js))
}

function include(js) {
  var inNodeModules = /node_modules/.test(js)
  return !inNodeModules || (allCompile ? !IGNORE_EXP.test(js) : includes(js));
}

function includes(js) {
  js = js.split('node_modules').pop();
  for (var i = 0, k = MODULES_REG.length; i < k; i++) {
    if (js.indexOf('react-native-on-web') < 0 && MODULES_REG[i].test(js)) {
      return true;
    }
  }
}

