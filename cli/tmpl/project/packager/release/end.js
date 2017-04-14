/***
 * 名称：发布任务--结尾处理
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra');
var path = require('path');
var dantejs = require('dantejs');
var Zip = require('../modules/zip.js');

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
    //this.package();
}

/**
 * 配置发布后的package.json
 */
ReleaseManager.prototype.configPackage = function() {
    var releaseDir = config.releaseDir;
    var pgkfile = path.join(releaseDir, 'package.json')
    var pgk = fse.readJsonSync(pgkfile)
    var es6Modules = config.es6Modules;
    delete pgk.devDependencies;
    pgk.scripts = {
        "init": "npm install --registry=https://registry.npm.taobao.org",
        "pm2": "pm2 start pm2.json",
        "start": "npm run init && cross-env NODE_ENV=production node ./server/index.js",
        "postinstall": "node install.js",
        "postupdate": "node install.js"
    }
    fse.writeFileSync(path.join(releaseDir, 'install.js'), '(' + copyRepo.toString() + '());');
    fse.writeJsonSync(pgkfile, pgk)
}

/**
 * 配置web.json
 * 修改启动端口为80
 * 修改资源版本号为当前时间
 */
ReleaseManager.prototype.configWeb = function() {
    var file = path.join(config.releaseDir, 'web.json')
    var webConfig = fse.readJsonSync(file)
    webConfig.port = 9080;
    webConfig.version = new Date().getTime()
    fse.writeJsonSync(file, webConfig)
}

/**
 * 打包发布目录压缩包
 */
ReleaseManager.prototype.package = function() {
    var dir = path.dirname(config.releaseDir);
    var file = path.join(dir, 'node_msites-' + dantejs.Date.format(new Date(), 'yyyyMMdd') + ".zip");
    Zip.archive(file, config.releaseDir);
}

function copyRepo() {
    var fse = require('fs-extra');
    fse.copySync('./repo/', './node_modules');
}

// 执行发布结尾处理
var manager = new ReleaseManager();
manager.endRelease();