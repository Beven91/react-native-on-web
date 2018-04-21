/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

//依赖>>：
var path = require('path');
var yargs = require('yargs');
var Pack = require('react-native-on-web-bundler');

var configPath = path.join(__dirname, 'rnw-config.js');

// 配置参数类型
yargs.options({
  'releaseDir': {
    type: 'string',
    alias: 't',
    describe: 'release assets target dir'
  },
  'client': {
    type: 'string',
    alias: 'c',
    describe: 'release client side code'
  },
  'server': {
    type: 'string',
    alias: 's',
    describe: 'release server side code'
  },
  'install': {
    type: 'string',
    alias: 'i',
    defalt: false,
    describe: 'release after use npm install build node_modules'
  }
}).parse(process.argv);

yargs.usage('\nUsage: react-native-on-web --releaseDir=targetdir').help()

if (process.argv.length <= 2) {
  return yargs.showHelp();
}

var config = yargs.argv;

if (!config.releaseDir) {
  return console.error('ReactNativeOnWeb: missing options --releaseDir ')
}

Pack.runPack(configPath, config.client, config.server, config.releaseDir);
