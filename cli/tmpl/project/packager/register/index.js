/**
 * 名称：使reuqire支持react-native所有特性
 * 日期：2017-04-05
 * 描述：使nodejs在运行时支持es6 es7 react-native 等等
 */

//依赖>>
var path  =require('path');
var fse  =require('fs-extra');

// 获取webpack配置
var webpack = require('../webpack/webpack.client.js')
var presets = fse.readJSONSync(path.join(__dirname,'../../.babelrc')).presets;

//1.引入polyfill
require('babel-polyfill')

//2.启用babel-register
require('babel-register')({
    presets: presets, 
    ignore:/node_modules[/\\](babel-|regenerator-transform|babel)/,
    compact: true, 
    extensions: webpack.resolve.extensions
})

//3.静态资源加载
require('./url-register.js');

//4.react-native 别名处理
require('./react-native-register.js');