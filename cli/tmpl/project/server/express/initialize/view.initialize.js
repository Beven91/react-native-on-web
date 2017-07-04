/**
 * 名称：设置视图母版配置
 * 日期：2016-11-25
 * 描述：
 */

//引入依赖>>
import path from 'path';
import appContext from 'app-context';
import exphbs from 'express-handlebars';

//获取express app对象
const app = appContext.getParam('app');
//获取web配置对象
const webConfig = appContext.getParam('web');
//视图引擎全局数据
const locals = app.locals;

//添加handlebars视图引擎
const handlebars = exphbs.create({
    layoutsDir: path.join(__dirname, '..', 'webapp/views/layout'),
    defaultLayout: 'layout',
    extname: '.hbs'
})

//设置视图引擎
app.engine('hbs', handlebars.engine);

//设置视图引擎
app.set('view engine', 'hbs');
//设置视图基础目录
app.set('views', path.join(__dirname, '..', 'webapp/views'));

//设置全局编译数据
locals.__version__ = webConfig.version;
locals.__env__ = appContext.env;
locals.__isDevelopment__ = appContext.isDev;
locals.__cdnUrl__ = webConfig.cdnUrl || '';
locals.__cdnUrlName__ = webConfig.cdnVariableName;
global[locals.__cdnUrlName__] = locals.__cdnUrl__;
