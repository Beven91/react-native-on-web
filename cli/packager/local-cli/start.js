/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

//依赖>>：
var path  =require('path');
var yargs = require('yargs')
var Npm = require('../../helpers/npm.js')
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
  }
})

// // 解析参数
yargs.parse(argv)

if(argv.length<=2){
   return yargs.showHelp();
}

//安装配置
Configuration.session(yargs.argv);

var config = yargs.argv;
if(config.client==undefined && config.server==undefined){
  config.client = config.server  =true;
} 

if(null!=config.server){
  //执行服务端打包
  (new Npm()).exec('cross-env',[
      "NODE_ENV=production",
      "webpack",
      "--colors",
      "--config",
      path.join(__dirname,'..','..',"packager/webpack/webpack.server.js")
  ]);
}

if(null!=config.client){
  //执行客户端端打包
  (new Npm()).exec('cross-env',[
      "NODE_ENV=production",
      "webpack",
      "--colors",
      "--config",
      path.join(__dirname,'..','..',"packager/webpack/webpack.client.js")
  ]);
}