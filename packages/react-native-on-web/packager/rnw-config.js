/**
 * react-native-on-web 打包默认配置
 */

var path = require('path');
var fse = require('fs-extra');
var web = require(path.resolve('web.json'));
var Pack = require('rnw-bundler');

var packager = path.resolve('.packager.js');
var projectPackager = fse.existsSync(packager) ? require(packager) : {};
var projectRoot = hasPackageReactOnWeb(process.cwd()) ? process.cwd() : path.resolve('web');
var nodeModulesPath = path.join(__dirname, '../');

var defaultConfig = {
  projectRoot: projectRoot,
  copyNodeModules: true,
  alias: {
    'react-native-on-web-index-web-js': path.resolve(web.indexWeb),
    'react': use('node_modules/react'),
    'react-dom': use('node_modules/react-dom'),
    'babel-polyfill': use('node_modules/babel-polyfill'),
    'NativeModules': path.resolve('node_modules/react-native-on-web'),
    'react-native': path.resolve('node_modules/react-native-on-web'),
    'whatwg-fetch': use('node_modules/whatwg-fetch'),
    'react-native-web/dist/exports/AsyncStorage':'react-native-on-web/src/apis/AsyncStorage',
    'react-native-web/dist/exports/LayoutAnimation':'react-native-on-web/src/apis/LayoutAnimation/LayoutAnimation',
    'react-native-web/dist/exports/Modal':'react-native-on-web/src/components/Modal/Modal',
    'react-native-web/dist/exports/Navigator':'react-native-on-web/src/components/Navigator',
    'react-native-web/dist/exports/ToastAndroid':'react-native-on-web/src/components/ToastAndroid/ToastAndroid',
    'react-native-web/dist/exports/TabBarIOS':'react-native-on-web/src/components/TabBarIOS/TabBarIOS',
    'react-native-web/dist/exports/Picker':'react-native-on-web/src/components/Picker/Picker',
  }
}

function use(id) {
  var modulePath = path.join(nodeModulesPath, id);
  return fse.existsSync(modulePath) ? modulePath : path.resolve(id);
}

function hasPackageReactOnWeb(dir) {
  var packageJsonPath = path.join(dir, 'package.json')
  var dependencies = fse.existsSync(packageJsonPath) ? Object.keys(require(packageJsonPath).dependencies) : []
  return dependencies.indexOf('react-native-on-web') > -1
}

module.exports = Pack.Options.merge(defaultConfig, projectPackager);
