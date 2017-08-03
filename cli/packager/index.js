/**
 * 名称：react-native-on-web 打包发布入口 
 * 日期：2017-05-18
 * 作者：Beven
 * 描述：用于进行web平台打包发布
 */

//依赖>>：
var path = require('path');
var Pack = require('rnw-bundler');

/**
 * 执行打包
 * @param {String} releaseDir 发布目标目录
 * @param mode 发布模式(server/client)
 */
module.exports = function (releaseDir, mode) {
    var client = (!mode || mode === 'client');
    var server = (!mode || mode === 'server');
    var configPath = path.join(__dirname, 'rnw-config.js');
    Pack.runPack(configPath, client, server, releaseDir);
}
