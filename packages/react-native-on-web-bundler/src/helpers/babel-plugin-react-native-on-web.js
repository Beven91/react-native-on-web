/**
 * @name react-native-web 组件扩展babel插件
 * @date 2018-04-22
 * @description 
 *      用于将react-native-on-web扩展的组件填充到react-native-web中
 */
var moduleMap = require('babel-plugin-react-native-web/src/moduleMap');

module.exports = function (alias) {
  var compactKeys = Object.keys(alias || {});
  compactKeys = compactKeys.filter(function (k) { return k.indexOf('react-native-web') > -1; })
  compactKeys = compactKeys.map(function (k) { return k.split('/').pop(); });
  compactKeys.forEach(function (k) {
    moduleMap[k] = true;
  })
  return {}
}