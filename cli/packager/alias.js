var path  =require('path');
var webConfig = require(path.resolve('web.json'));

module.exports = {
  'react-native-on-web-index-web-js':path.resolve(webConfig.indexWeb),
  'react': path.resolve('node_modules/react'),
  'react-dom': path.resolve('node_modules/react-dom'),
  'babel-polyfill': path.resolve('node_modules/babel-polyfill'),
  'NativeModules': path.resolve('node_modules/react-native-on-web'),
  'react-native': path.resolve('node_modules/react-native-on-web'),
  'logger': path.resolve('server/framework/logger'),
  'app-context': path.resolve('server/framework/env/enviroment.js'),
  'whatwg-fetch': path.resolve('node_modules/whatwg-fetch')
}