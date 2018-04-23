/**
 * 名称：服务端node代码babel代码编译配置
 * 日期：2017-05-09
 */

var Options = require('./helpers/options');
var Configuration = require('./helpers/configuration.js')

var config = Configuration.get();
var excludeExp = /node_modules[/\\](babel-|regenerator-transform|happypack|babel|webpack)/;
var includeExps = [
  /react-native-/
].concat((config.es6Modules || []))

module.exports = {
  babelRc: Options.merge({
    presets: [require.resolve('babel-preset-react-native')],
    ignore: exclude,
    babelrc: false,
    compact: true,
    plugins: [
      require('./helpers/babel-plugin-react-native-on-web')(config.alias),
      require.resolve('babel-plugin-react-native-web'),
      [
        require.resolve('babel-plugin-transform-react-remove-prop-types'), {
          'mode': 'wrap'
        }]
    ],
    extensions: ['.web.js', '.js']
  }, config.babelrc),
  exclude: exclude,
  include2: include
}

function exclude(js) {
  return !include(js);
}

function include(js) {
  if (/react-native-on-web-bundler/.test(js)) {
    return false;
  } else if (!/node_modules/.test(js)) {
    return true;
  } else if (config.compileAll) {
    return !excludeExp.test(js)
  } else if (excludeExp.test(js)) {
    return false;
  } else {
    js = js.split('node_modules').pop();
    for (var i = 0, k = includeExps.length; i < k; i++) {
      if (includeExps[i].test(js)) {
        return true;
      }
    }
  }
}