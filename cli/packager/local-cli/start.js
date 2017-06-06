/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

//依赖>>：
var path  =require('path');
var yargs = require('yargs')
var fse  =require('fs-extra');
var logger = require('../../logger.js')
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
  },
  'install': {
    type: 'string',
    alias: 'i',
    defalt:false,
    describe: 'release after use npm install build node_modules'
  }
})

// // 解析参数
yargs.parse(argv)

if(argv.length<=2){
   return yargs.showHelp();
}

var config = yargs.argv;

//判断发布目录是否存在，如果存在 则修改发布目录为 config.releaseDir/react-web
config.releaseDir = path.join(config.releaseDir,'react-web');

//设置install值
config.install = config.install!=undefined && config.install!==false;

//安装配置
Configuration.session(config);

//模式判定 如果在没有传递--server 或者--client时 默认同时打包服务端客户端
if(config.client==undefined && config.server==undefined){
  config.client = config.server  =true;
} 

//如果是完全打包，则发布前执行删除发布目录
if(config.server && config.client){
  logger.info("ReactNativeOnWeb: Remove dir:"+config.releaseDir);
  fse.removeSync(config.releaseDir);
}

var env  ={NODE_ENV:'production'}

//执行服务端打包
if(null!=config.server){
  logger.info("\nReactNativeOnWeb: Bundle server side .......");
  (new Npm()).exec('webpack',[
      "--colors",
      "--config",
      path.join(__dirname,'..','..',"packager/webpack/webpack.server.js")
  ],env);
}

//执行客户端端打包
if(null!=config.client){
  logger.info("\nReactNativeOnWeb: Bundle client side .......");
  (new Npm()).exec('webpack',[
      "--colors",
      "--config",
      path.join(__dirname,'..','..',"packager/webpack/webpack.client.js")
  ],env);
}

//如果采用npm install模式 构建发布后的node_modules
if(config.install){
  logger.info("\nReactNativeOnWeb: use npm install build node_mdoules ...........");
  (new Npm(config.releaseDir)).install('--production');
}
logger.info("\n\nReactNativeOnWeb:  Bundle complete!");
