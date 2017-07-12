/**
 * 名称：M站日志管理对象
 * 日期：2017-01-05
 * 描述：用于记录M站相关应用程序日志
 */

//依赖引入>>
import path from 'path';
import winston from 'winston';
import fse from 'fs-extra';
import dantejs from 'dantejs';
import 'colors';

//日志保存目录
const logDirectory = path.resolve('logs/app/');

//日志状态颜色
const levelColors = {
    INFO: 'gray',
    ERROR: 'red',
    DEBUG: 'blue',
    WARN: 'yellow'
}

//确保目录存在
fse.ensureDirSync(logDirectory);

//创建日志对象
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: () => Date.now(),
            colorize: true,
            formatter: formatter
        }),
        new (winston.transports.File)({
            formatter: formatter,
            filename: path.join(logDirectory, 'out.log'),
            timestamp: 'true',
            maxsize: 10485760,
            maxFiles: 10,
        })
    ]
});

//监听全局未捕获异常，并且输出日志
process.on('uncaughtException', (err) => logger.error(err));

/**
 * 格式化日志输出
 */
function formatter(options) {
    let date = dantejs.Date.format(options.timestamp(), 'yyyy-MM-dd HH:mm:ss');
    let level = options.level.toUpperCase();
    let meta = (options.meta || {});
    let message = (options.message ? options.message : '');
    let stack = (meta.stack ? meta.stack : '');
    let levelColor = levelColors[level] || 'white';
    return (`【${date}】 ${level}  ${message} ${stack}`)[levelColor];
}

//公布日志对象
module.exports = logger;