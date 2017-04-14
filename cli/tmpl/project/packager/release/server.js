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
var shell = require('../modules/shell.js')

//是否使用webpack打包服务端app代码
var __WebpackServerBundle__ = global.__WebpackServerBundle__;
// 获取babelrc配置文件
var babelRc = fse.readJsonSync(path.resolve('.babelrc'))
    // 发布目录
var releaseDir = config.releaseDir
    // npm bin目录
var binPath = path.resolve('node_modules/.bin')
    // node_modules目录
var nodeMoudlesPath = path.resolve('node_modules')
    // 发布目录node_modules目录
var targetNodeModulesPath = path.join(releaseDir, 'node_modules')

// 要编译的目录
var fromdir = path.resolve('')
    // 获取node_modules下需要编译的模块
var es6_node_modules = dantejs.Array.ensureArray(config.es6Modules).join(',')

// ignore
var ignore = [
    '.vscode',
    '.git',
    '/build/',
    '/logs/',
    '.gitignore',
    '/node_modules/',
    'node-msites.iml',
    'npm-debug.log'
]

if (__WebpackServerBundle__) {
    ignore.push('/app/');
}

// 组装构建命令
var script = dantejs.String.format('babel {0} -D --ignore={1} --out-dir={2}', fromdir, ignore, releaseDir)
var nodeModulesScript = dantejs.String.format('babel {0} -D --only={1} --out-dir={2}', nodeMoudlesPath, es6_node_modules, targetNodeModulesPath)

//copy node_modules
fse.copySync(nodeMoudlesPath,targetNodeModulesPath);
// 开始编译
shell.exec(script, binPath, compileNodeModules)

/**
 * 编译node_modules目录
 */
function compileNodeModules() {
    if (__WebpackServerBundle__) {
        makeRunEnviroment();
    } else {
        // 编译node_modules
        shell.exec(nodeModulesScript, binPath, makeRunEnviroment)
    }
}

/**
 * 定制发布后程序启动环境
 */
function makeRunEnviroment() {
    // build目录
    var buildPath = path.resolve('build')
    var targetBuildPath = path.join(releaseDir, 'build')
    var copyList = ['modules', 'register', 'config.js']
    var fn = __WebpackServerBundle__ ? webpackServerRequireMoudles : requireModules;

    // 复制build目录
    copyList.map(function(name) {
        fse.copySync(path.join(buildPath, name), path.join(targetBuildPath, name))
    });

    // 清除babel-register.js中内容
    fse.writeFileSync(path.join(targetBuildPath, 'register', 'babel-register.js'), 'module.exports=' + fn.toString());
}

/**
 * 如果是使用webpack打包server代码 则使用此函数
 */
function webpackServerRequireMoudles() {

}

/**
 * 如果不是使用webpack打包server代码 则使用此函数
 */
function requireModules() {
    //原始require
    var originRequire = module.constructor.prototype.require;
    /**
     * 重写require  添加别名处理
     */
    module.constructor.prototype.require = function(name) {
        name = name.replace(".jsx", ".js");
        try {
            return originRequire.call(this, name);
        } catch (ex) {
            throw ex;
        }
    }
}