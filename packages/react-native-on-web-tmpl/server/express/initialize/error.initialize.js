/**
 * 名称：初始化网站异常处理配置
 * 日期：2016-11-25
 * 描述：
 */

//引入依赖>>
import appContext from 'app-context';
import exceptionMiddleware from '../handlers/500.js';
import notFoundMiddleware from '../handlers/404.js';

//获取express app对象
const app = appContext.getParam('app');

//定义err处理中间件
app.use(exceptionMiddleware);

//定义404处理中间件
app.use(notFoundMiddleware);