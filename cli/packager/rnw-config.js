/**
 * react-native-on-web 打包默认配置
 */

var path = require('path');
var fse = require('fs-extra');
var web = require(path.resolve('web.json'));
var Pack = require('rnw-bundler');

var packager = path.resolve('.packager.js');
var projectPackager = fse.existsSync(packager) ? require(packager) : {};

var defaultConfig = {
    projectRoot: path.resolve(''),
    alias: {
        'react-native-on-web-index-web-js': path.resolve(web.indexWeb),
        'react': path.resolve('node_modules/react'),
        'react-dom': path.resolve('node_modules/react-dom'),
        'babel-polyfill': path.resolve('node_modules/babel-polyfill'),
        'NativeModules': path.resolve('node_modules/react-native-on-web'),
        'react-native': path.resolve('node_modules/react-native-on-web'),
        'whatwg-fetch': path.resolve('node_modules/whatwg-fetch')
    }
}

module.exports = Pack.Options.merge(defaultConfig, projectPackager);