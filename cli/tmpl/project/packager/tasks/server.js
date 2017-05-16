/***
 * 名称：发布任务--构建服务端代码
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra')
var path = require('path')
var config = require('../config.js')
var dantejs = require('dantejs')

// 发布目录
var releaseDir = config.releaseDir
// web目录
var webDir = path.join(releaseDir, 'web')
// npm bin目录
var binPath = path.resolve('node_modules/.bin')
// node_modules目录
var nodeMoudlesPath = path.resolve('node_modules')
// 发布目录node_modules目录
var targetNodeModulesPath = path.join(webDir, 'node_modules')

// 要编译的目录
var fromdir = path.resolve('')

// ignore
var ignore = [
  '.vscode',
  '.git',
  '/build/',
  '/logs/',
  '.gitignore',
  '.happypack/',
  '/node_modules/',
  'node-msites.iml',
  'npm-debug.log'
]

// 组装构建命令
var script = dantejs.String.format('babel {0} -D --ignore={1} --out-dir={2}', fromdir, ignore, webDir)

// 开始编译
require('child_process').execSync(script, {
  cwd: binPath,
  stdio: [process.stdin, process.stdout, process.stderr]
})

// copy node_modules
console.log('copy node_modules ....');
fse.copySync(nodeMoudlesPath, targetNodeModulesPath)
console.log('copy index.web.js ....');
fse.copySync(path.join(path.resolve(''),'../index.web.js'),path.join(releaseDir,'index.web.js'));