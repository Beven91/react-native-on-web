/**
 * @name 打包manifest
 * @date 2018-04-21
 * @description 用于提供给服务端需要加载那些js以及css
 */
var path = require('path');
var fse = require('fs-extra');

function AssetsPlugin() {

}

AssetsPlugin.prototype.findAssets = function (assets, type, publicPath) {
  var reg = new RegExp('\\.' + type + '$');
  return assets.filter(function (name) {
    return reg.test(name);
  }).map(function (name) {
    return publicPath + name;
  })
}

AssetsPlugin.prototype.apply = function (compiler) {
  var findAssets = this.findAssets;
  var options = compiler.options || {};
  var publicPath = options.output.publicPath;
  compiler.plugin('emit', function (compilation, callback) {
    var assets = Object.keys(compilation.assets);
    var webpack = {
      jsAssets: findAssets(assets, 'js', publicPath),
      cssAssets: findAssets(assets, 'css', publicPath)
    }
    fse.writeJSONSync(path.resolve('assets.json'), webpack);
    callback();
  });
}

module.exports = AssetsPlugin;