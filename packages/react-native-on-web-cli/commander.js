/**
 * 名称: react-native-on-wb cli命令行支持
 * 日期：2017-04-01
 * 作者: Beven
 * 描述：用于针对不同终端，提供标准的命令行信息
 */

// 引入依赖>>
let program = require('commander');
let pgk = require('./package.json');
let cli = require('./cli.js');

module.exports = function (argv) {
  // 默认参数
  if (argv.length <= 2) {
    argv.push('-h');
  }

  program
    .version(pgk.version)
    .usage('reactWeb [command] [options]');

  program
    .command('init')
    .action(cli.run('initReactWeb'))
    .description('创建一个新的react-native web工程');

  program
    .command('start')
    .action(cli.run('start'))
    .description('启动web平台');

  program
    .command('bundle')
    .allowUnknownOption()
    .action(cli.run('bundle'))
    .description('打包Web平台工程，例如:react-native-on-web bundle --releaseDir=d:/release --client --server(client:打包客户端,server打包服务端,不填写全部打包)');

  program
    .command('remove')
    .action(cli.run('remove'))
    .description('删除web平台工程');

  program
    .command('upgrade')
    .action(cli.run('upgrade'))
    .description('更新react-native-on-web');

  // 解析参数
  program.parse(argv);
};
