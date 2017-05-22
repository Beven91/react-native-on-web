/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

//依赖>>：
var path  =require('path');
var yargs = require('yargs')
var Npm = require('./npm.js')
var Configuration = require('./config.js');

var argv  = process.title=="npm"? JSON.parse(process.env.npm_config_argv).original : process.argv;

// 定义用例
yargs.usage('\nUsage: react-native-on-web --releaseDir=targetdir').help()

// 配置参数类型
yargs.options({
  'releaseDir': {
    type: 'string',
    alias: 't',
    describe: 'release assets target dir'
  }
})

// // 解析参数
yargs.parse(argv)

if(argv.length<=2){
   return yargs.showHelp();
}

//安装配置
Configuration.session(yargs.argv);

// 执行webpack进行打包
(new Npm()).run('webpack')