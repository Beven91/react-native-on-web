/**
 * 名称：React-Native Web别名模块加载器
 * 日期：2017-04-05
 * 描述：用于实现开发环境将具体的模块使用别名模块进行引用
 */
var path = require('path')
var imageWeb = require('image-web-loader');

// 原始require
var ORIGINAL_RESOLVE_FILENAME = module.constructor._resolveFilename
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
module.constructor._resolveFilename = function (name, mod, isMain) {
  name = xAssetsPlugin.getRequest(name, path.dirname(mod.id)) || name;
  var id = ReactNativeWebAlias[name] || name
  return ORIGINAL_RESOLVE_FILENAME.call(this, id, mod, isMain)
}