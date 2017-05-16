/**
 * 网站打包配置
 */

//引入依赖>>
var path = require('path');
var fs = require('fs-extra');

//工程根目录
var rootDir = path.join(__dirname, '..');
//发布目录
var releaseDir = path.join(rootDir, '../release/react-web/');

// 默认本地图片路径
var imageAssets = [
  path.join(path.resolve(''),'..','android/app/src/main/res/drawable/'),
  path.join(path.resolve(''),'..','ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
  path.resolve('assets/images')
]

module.exports = {
    rootDir: rootDir,
    releaseDir: releaseDir,
    imageAssets:imageAssets,
    alias: {
      'react': path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
      'babel-polyfill': path.resolve('node_modules/babel-polyfill'),
      'NativeModules': path.resolve('node_modules/react-native-on-web'),
      'react-native': path.resolve('node_modules/react-native-on-web'),
      'logger': path.resolve('server/logger'),
      'app-context': path.resolve('server/env/enviroment.js'),
      'dantejs': path.resolve('node_modules/dantejs'),
      'react-native-web': path.resolve('node_modules/react-native-web'),
      'react-router': path.resolve('node_modules/react-router'),
      'whatwg-fetch': path.resolve('node_modules/whatwg-fetch')
    }
};