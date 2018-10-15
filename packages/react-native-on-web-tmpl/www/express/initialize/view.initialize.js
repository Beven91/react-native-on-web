/**
 * 名称：设置视图母版配置
 * 日期：2016-11-25
 * 描述：
 */

// 引入依赖>>
import path from 'path';
import appContext from 'app-context';
import cshtml from 'node-razor';

// 获取express app对象
const app = appContext.getParam('app');
// 视图引擎全局数据
const locals = app.locals;

// 添加handlebars视图引擎
const cshtmlOptions = {
  layout: 'layout',
  layoutDir: path.join(__dirname, '..', 'views/layout'),
};

// 添加vash视图引擎
app.engine('cshtml', cshtml(cshtmlOptions));
// 设置当前使用的默认视图引擎
app.set('view engine', 'cshtml');
// 设置视图查找目录
// 设置视图基础目录
app.set('views', path.join(__dirname, '..', 'views'));

// 设置全局编译数据
locals.DEV = appContext.isDev;
