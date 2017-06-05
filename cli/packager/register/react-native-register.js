/**
 * 名称：React-Native Web别名模块加载器
 * 日期：2017-04-05
 * 描述：用于实现开发环境将具体的模块使用别名模块进行引用
 */
var path = require('path')
var fs = require('fs')
var imageWeb = require('image-web-loader');

// 原始require
var originRequire = module.constructor.prototype.require
// 配置
var config = require('../config.js');

//RequireImageXAssetPlugin 用于支持require('image!x')
var xAssetsPlugin = new (imageWeb.RequireImageXAssetPlugin)(config.imageAssets);

// 别名模块
var ReactNativeWebAlias = config.alias || {
  'react-native': 'react-native-on-web'
}

/**
 * 重写require  添加别名处理
 */
module.constructor.prototype.require = function (name) {
  name = xAssetsPlugin.getRequest(name,path.dirname(this.id)) || name;
  var id = ReactNativeWebAlias[name] || name
  return originRequire.call(this, id)
}