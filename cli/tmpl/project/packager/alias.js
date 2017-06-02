var path  =require('path');
var webConfig = require(path.resolve('web.json'));

module.exports = {
  'react-native-on-web-index-web-js':path.resolve(webConfig.indexWeb),
  'react': path.resolve('node_modules/react'),
  'react-dom': path.resolve('node_modules/react-dom'),
  'babel-polyfill': path.resolve('node_modules/babel-polyfill'),
  'NativeModules': path.resolve('node_modules/react-native-on-web'),
  'react-native': path.resolve('node_modules/react-native-on-web'),
  'logger': path.resolve('server/logger'),
  'app-context': path.resolve('server/env/enviroment.js'),
  'react-router': path.resolve('node_modules/react-router'),
  'whatwg-fetch': path.resolve('node_modules/whatwg-fetch')
}
