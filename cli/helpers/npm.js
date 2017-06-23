/**
 * 名称：npm 执行工具
 * 日期：2017-04-14
 * 描述：通过代码方式执行npm命令
 */

var path = require('path')

var run = '@@__run__@@'

function Npm(cwd) {
  this.cwd = cwd || process.cwd()
}

/**
 * 执行npm start
 */
Npm.prototype.start = function () {
  this[run](['start'])
}

/**
 * 执行npm install
 */
Npm.prototype.install = function (script) {
  var args = (script || '').split(' ')
  args.unshift('install')
  this[run](args)
}

/**
 * 执行npm指定命令
 * @param name 要执行的脚本命令名称
 * @param args 其他参数
 * @param cwd 运行目录
 */
Npm.prototype.run = function (name, args, cwd) {
  args = args || []
  args.unshift(name)
  args.unshift('run')
  this[run](args)
}

/**
 * 执行一个npm脚本命令
 * @param  {Array} args 参数 
 */
Npm.prototype[run] = function (args) {
  var npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  require('child_process').spawnSync(npm, args, {
    cwd: this.cwd,
    stdio: [process.stdin, process.stdout, process.stderr]
  })
}

/**
 * 执行包下指定js文件
 * @param {String} js 要执行的js文件路径
 * @param  {Array} args 参数
 */
Npm.prototype.node = function (js, args, cwd) {
  args = args || []
  args.unshift(js)
  require('child_process').spawnSync('node', args, {
    cwd: cwd || this.cwd,
    stdio: [process.stdin, process.stdout, process.stderr]
  })
}

/**
 * 执行指定命令
 * @param  {String} name 命令名称 例如: node
 * @param  {Array} args 参数
 */
Npm.prototype.exec = function (name, args, env) {
  args = args || []
  name = path.join(this.cwd, 'node_modules/.bin/', name)
  name = process.platform === 'win32' ? name + '.cmd' : name
  require('child_process').spawnSync(name, args, {
    cwd: this.cwd,
    env: env,
    stdio: [process.stdin, process.stdout, process.stderr]
  })
}

// 公布引用
module.exports = Npm
