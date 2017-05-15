/**
 * 网站打包配置
 */

//引入依赖>>
var path = require('path');
var fs = require('fs-extra');

//工程根目录
var rootDir = path.join(__dirname, '..');
//发布目录
var releaseDir = path.join(rootDir, '../release/node-msites');

// 默认本地图片路径
var imageAssets = [
  path.join(path.resolve(''),'..','android/app/src/main/res/drawable/'),
  path.join(path.resolve(''),'..','ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
  path.resolve('assets/images')
]

module.exports = {
    rootDir: rootDir,
    releaseDir: releaseDir,
    imageAssets:imageAssets
};