/**
 * 名称：初始化网站日志存储
 * 日期：2017-01-05
 * 描述：
 */

//引入依赖>>
import fse from 'fs-extra';
import path from 'path';
import morgan from 'morgan';
import appContext from 'app-context';
import FileStreamRotator from 'file-stream-rotator';

//获取express app对象
const app = appContext.getParam('app');

//网站http日志
const webLogDir = path.resolve('logs/weblogs');

//确定传入目录始终存在
fse.ensureDirSync(webLogDir);

//配置日志拆分
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(webLogDir, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

//配置日志中间件
app.use(morgan('combined', {
    stream: accessLogStream
}))