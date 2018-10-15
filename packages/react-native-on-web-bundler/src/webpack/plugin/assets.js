/**
 * @name 打包manifest
 * @date 2018-04-21
 * @description 用于提供给服务端需要加载那些js以及css
 */
let path = require('path');
let fse = require('fs-extra');
// 配置文件
let config = require('../../rnw-config.js')();

function AssetsPlugin() {

}

AssetsPlugin.prototype.findAssets = function (assets, type, publicPath) {
  let reg = new RegExp('\\.' + type + '$');
  return assets.filter(function (name) {
    return reg.test(name);
  }).map(function (name) {
    return publicPath + name;
  });
};

AssetsPlugin.prototype.apply = function (compiler) {
  let findAssets = this.findAssets;
  let options = compiler.options || {};
  let publicPath = options.output.publicPath;
  compiler.plugin('emit', function (compilation, callback) {
    let assets = Object.keys(compilation.assets);
    let webpack = {
      jsAssets: findAssets(assets, 'js', publicPath),
      cssAssets: findAssets(assets, 'css', publicPath),
    };
    fse.writeJSONSync(path.join(config.releaseDir, 'assets.json'), webpack);
    callback();
  });
};

module.exports = AssetsPlugin;
