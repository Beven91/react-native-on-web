/**
 * 名称：使reuqire支持react-native所有特性
 * 日期：2017-04-05
 * 描述：使nodejs在运行时支持es6 es7 react-native 等等
 */
module.exports = function (configPath, releaseDir) {
  require('../helpers/configuration').session(configPath, releaseDir);

  let config = require('../rnw-config.js')();
  let Options = require('../helpers/options');

  // 1.引入polyfill
  require('babel-polyfill');

  // 2.启用babel-register
  require('babel-register')(Options.merge({}, config.babelRc));

  // 3.react-native 别名处理
  require('./react-native-register.js');

  // 4.静态资源加载
  require('./url-register.js');
};
