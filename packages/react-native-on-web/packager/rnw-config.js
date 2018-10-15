/**
 * react-native-on-web 打包默认配置
 */

let path = require('path');
let fse = require('fs-extra');
let Pack = require('react-native-on-web-bundler');

let bundlerc = path.resolve('.bundlerc.js');
let bundleOptions = fse.existsSync(bundlerc) ? require(bundlerc) : {};
let selfRoot = process.cwd();
let projectRoot = hasPackageReactOnWeb(selfRoot) ? selfRoot : path.resolve('web');

let defaultConfig = {
  projectRoot: projectRoot,
  copyNodeModules: true,
  alias: {
    'react-native-on-web-index-web-js': bundleOptions.serverContextEntry,
    'NativeModules': 'react-native-web',
    'react-native-web/dist/exports/LayoutAnimation': 'react-native-on-web/src/apis/LayoutAnimation/LayoutAnimation',
    'react-native-web/dist/exports/AsyncStorage': 'react-native-on-web/src/apis/AsyncStorage',
    'react-native-web/dist/exports/Modal': 'react-native-on-web/src/components/Modal/Modal',
    'react-native-web/dist/exports/Navigator': 'react-native-on-web/src/components/Navigator',
    'react-native-web/dist/exports/ToastAndroid': 'react-native-on-web/src/components/ToastAndroid/ToastAndroid',
    'react-native-web/dist/exports/TabBarIOS': 'react-native-on-web/src/components/TabBarIOS/TabBarIOS',
  },
};

function hasPackageReactOnWeb(dir) {
  let packageJsonPath = path.join(dir, 'package.json');
  let pgk = fse.existsSync(packageJsonPath) ? (require(packageJsonPath)) : {};
  let dependencies = Object.keys(pgk.dependencies || {}).concat(Object.keys(pgk.devDependencies || {}));
  return dependencies.indexOf('react-native-on-web') > -1;
}

module.exports = Pack.Options.merge(defaultConfig, bundleOptions);
