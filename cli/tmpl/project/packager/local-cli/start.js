/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

var path = require('path')
var yargs = require('yargs')
var fse = require('fs-extra')
var Npm = require('./npm.js')

// 配置文件存放位置
var packagerfile = path.resolve('.packager')

// 定义用例
yargs.usage('react-native-on-web ' + require('../../package.json').version + '\n' +
  'react-native-on-web --target=targetdir')

// 配置参数类型
yargs.options({
  'releaseDir': {
    type: 'string',
    alias: 't',
    describe: 'release assets target dir'
  }
})

// 解析参数
yargs.parse(JSON.parse(process.env.npm_config_argv).original)
// 设置参数
var args = yargs.argv

// 参数校验
validateInput(args)

// 写出配置文件
fse.writeJSONSync(packagerfile, args)

// 进程异常监听
process.on('exit', onReleaseEnd)

process.on('uncaughtException', onReleaseEnd)

function onReleaseEnd () {
  if (fse.existsSync(packagerfile)) {
    fse.removeSync(packagerfile)
  }
}

// 执行webpack进行打包
(new Npm(path.resolve(''))).run('webpack')


/**
 * 校验输入参数是否合法
 * @param {Object} args 
 */
function validateInput (args) {
  if (args.releaseDir && !tryMkdir(args.releaseDir)) {
    throw new Error('发布目标目录(参数: -t 或者--releaseDir)' + args.releaseDir + ' 不存在!!!')
  }
  console.log("Release target dir is:"+ args.releaseDir);
}

/**
 * 尝试创建传入目录，如果创建失败 则返回false
 * @param {String} dir 
 */
function tryMkdir (dir) {
  try {
    fse.ensureDirSync(dir)
    return true
  } catch(ex) {
    return false
  }
}
