/**
 * react-native-on-web 打包默认配置
 */

var path = require('path');
var fse = require('fs-extra');
var web = require(path.resolve('web.json'));
var Pack = require('react-native-on-web-bundler');

var bundlerc = path.resolve('.bundlerc.js');
var bundleOptions = fse.existsSync(bundlerc) ? require(bundlerc) : {};
var projectRoot = hasPackageReactOnWeb(process.cwd()) ? process.cwd() : path.resolve('web');

var defaultConfig = {
  projectRoot: projectRoot,
  copyNodeModules: true,
  alias: {
    'react-native-on-web-index-web-js': path.resolve(web.indexWeb),
    'NativeModules': 'react-native-web',
    'react-native-web/dist/exports/LayoutAnimation': 'react-native-on-web/src/apis/LayoutAnimation/LayoutAnimation',
    'react-native-web/dist/exports/AsyncStorage': 'react-native-on-web/src/apis/AsyncStorage',
    'react-native-web/dist/exports/Modal': 'react-native-on-web/src/components/Modal/Modal',
    'react-native-web/dist/exports/Navigator': 'react-native-on-web/src/components/Navigator',
    'react-native-web/dist/exports/ToastAndroid': 'react-native-on-web/src/components/ToastAndroid/ToastAndroid',
    'react-native-web/dist/exports/TabBarIOS': 'react-native-on-web/src/components/TabBarIOS/TabBarIOS',
  }
}

function hasPackageReactOnWeb(dir) {
  var packageJsonPath = path.join(dir, 'package.json')
  var pgk = fse.existsSync(packageJsonPath) ? (require(packageJsonPath)) : {};
  var dependencies = Object.keys(pgk.dependencies || {}).concat(Object.keys(pgk.devDependencies || {}))
  return dependencies.indexOf('react-native-on-web') > -1
}

module.exports = Pack.Options.merge(defaultConfig, bundleOptions);
