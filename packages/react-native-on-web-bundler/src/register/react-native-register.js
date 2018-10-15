/**
 * 名称：React-Native Web别名模块加载器
 * 日期：2017-04-05
 * 描述：用于实现开发环境将具体的模块使用别名模块进行引用
 */
let path = require('path');
let imageWeb = require('image-web-loader');

// 原始require
let ORIGINAL_RESOLVE_FILENAME = module.constructor._resolveFilename;
// 原始js loader
let ORIGINAL_JS_EXTENSION = require.extensions['.js'];
let ORIGINAL_JSON_EXTENSION = require.extensions['.json'];
let ORIGINAL_NODE_EXTENSION = require.extensions['.node'];
// 配置
let config = require('../rnw-config.js')();

// RequireImageXAssetPlugin 用于支持require('image!x')
let xAssetsPlugin = new (imageWeb.RequireImageXAssetPlugin)(config.imageAssets);

// 别名模块
let ReactNativeWebAlias = config.alias || {
  'react-native': 'react-native-on-web',
};

// 重写js加载函数，用于将.web.js优先级提升至js前
delete require.extensions['.js'];
delete require.extensions['.json'];
delete require.extensions['.node'];
require.extensions['.web.js'] = ORIGINAL_JS_EXTENSION;
require.extensions['.js'] = ORIGINAL_JS_EXTENSION;
require.extensions['.json'] = ORIGINAL_JSON_EXTENSION;
require.extensions['.node'] = ORIGINAL_NODE_EXTENSION;

/**
 * 重写require  添加别名处理
 */
module.constructor._resolveFilename = function (name, mod, isMain) {
  name = xAssetsPlugin.getRequest(name, path.dirname(mod.id)) || name;
  let id = ReactNativeWebAlias[name] || name;
  mod.paths.push(path.resolve('node_modules'));
  return ORIGINAL_RESOLVE_FILENAME.call(this, id, mod, isMain);
};
