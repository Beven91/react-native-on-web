/**
 * 名称：React-Native Web别名模块加载器
 * 日期：2017-04-05
 * 描述：用于实现开发环境将具体的模块使用别名模块进行引用
 */
var path = require('path')
var imageWeb = require('image-web-loader');

// 原始require
var ORIGINAL_RESOLVE_FILENAME = module.constructor._resolveFilename
//原始js loader
var ORIGINAL_JS_EXTENSION = require.extensions['.js'];
var ORIGINAL_JSON_EXTENSION = require.extensions['.json'];
var ORIGINAL_NODE_EXTENSION = require.extensions['.node'];
// 配置
var config = require('../rnw-config.js');

//RequireImageXAssetPlugin 用于支持require('image!x')
var xAssetsPlugin = new (imageWeb.RequireImageXAssetPlugin)(config.imageAssets);

// 别名模块
var ReactNativeWebAlias = config.alias || {
  'react-native': 'react-native-on-web'
}

//重写js加载函数，用于将.web.js优先级提升至js前
delete require.extensions['.js'];
delete require.extensions['.json'];
delete require.extensions['.node'];
require.extensions['.web.js'] =  ORIGINAL_JS_EXTENSION;
require.extensions['.js'] = ORIGINAL_JS_EXTENSION;
require.extensions['.json'] = ORIGINAL_JSON_EXTENSION;
require.extensions['.node'] = ORIGINAL_NODE_EXTENSION;

/**
 * 重写require  添加别名处理
 */
module.constructor._resolveFilename = function (name, mod, isMain) {
  name = xAssetsPlugin.getRequest(name, path.dirname(mod.id)) || name;
  var id = ReactNativeWebAlias[name] || name
  return ORIGINAL_RESOLVE_FILENAME.call(this, id, mod, isMain)
}