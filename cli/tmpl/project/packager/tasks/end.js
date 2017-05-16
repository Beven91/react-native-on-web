/***
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra');
var path = require('path');
var dantejs = require('dantejs');

// 配置文件
var config = require('../config.js')

/**
 * 发布后处理工具
 */
function ReleaseManager() {}

/**
 * 发布结尾处理
 */
ReleaseManager.prototype.endRelease = function() {
    this.configPackage();
    this.configWeb();
}

/**
 * 配置发布后的package.json
 */
ReleaseManager.prototype.configPackage = function() {
    var releaseDir = config.releaseDir;
    var pgkfile = path.join(releaseDir,'web', 'package.json')
    var pgk = fse.readJsonSync(pgkfile)
    var es6Modules = config.es6Modules;
    delete pgk.devDependencies;
    pgk.scripts = {
        "init": "npm install --registry=https://registry.npm.taobao.org",
        "pm2": "pm2 start pm2.json",
        "start": "npm run init && cross-env NODE_ENV=production node ./server/index.js"
    }
    fse.writeJsonSync(pgkfile, pgk)
}

/**
 * 配置web.json
 * 修改启动端口为80
 * 修改资源版本号为当前时间
 */
ReleaseManager.prototype.configWeb = function() {
    var file = path.join(config.releaseDir,'web', 'web.json')
    var webConfig = fse.readJsonSync(file)
    webConfig.port = 8080;
    webConfig.version = new Date().getTime()
    fse.writeJsonSync(file, webConfig)
}

// 执行发布结尾处理
var manager = new ReleaseManager();
manager.endRelease();