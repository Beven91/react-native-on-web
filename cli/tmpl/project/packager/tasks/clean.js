/***
 * 名称：发布任务--清除任务
 * 日期：2016-11-18
 * 描述：无
 */

// 引入依赖>>
var fse = require('fs-extra')

// 配置文件
var config = require('../config.js')

var releaseDir = config.releaseDir

// 删除发布目录
fse.removeSync(releaseDir)

if (fse.existsSync(releaseDir)) {
    throw new Error('删除发布目录失败:（' + releaseDir + "）,是否目录被占用? 请关闭相关进程后，再重新试试！");
}