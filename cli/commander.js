/**
 * 名称: react-native-on-wb cli命令行支持
 * 日期：2017-04-01
 * 作者: Beven
 * 描述：用于针对不同终端，提供标准的命令行信息
 */

// 引入依赖>>
var program = require('commander')
var pgk = require('../package.json')
var cli = require('./cli.js')

module.exports = function (argv) {
  //默认参数
  if(argv.length<=2){
      argv.push('-h');
  }

  program
    .version(pgk.version)
    .usage('reactWeb [command] [options]')

  program
    .command('init')
    .action(cli.run('initReactWeb'))
    .description('创建一个新的react-native web工程')

  program
    .command('start')
    .action(cli.run('start'))
    .description('启动web平台')

  program
    .command('remove')
    .action(cli.run('remove'))
    .description('删除web平台工程')
  
  // 解析参数
  program.parse(argv)
}
