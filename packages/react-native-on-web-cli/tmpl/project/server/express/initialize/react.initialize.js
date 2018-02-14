/**
 * 名称：React-Native模式开发初始化
 * 日期：2016-11-25
 * 描述：用于配置Rn for web接入配置
 */

//引入依赖>>
import appContext from 'app-context';
//引入ReactApplication
import ReactWebServerApplication from '../react/server';

//获取express app对象
const app = appContext.getParam('app');
//创建reactWebServerApplication
const reactApplication =  new ReactWebServerApplication(appContext);

//react管道接入
app.get('*', (req,resp,next)=>reactApplication.handle(req,resp,next));