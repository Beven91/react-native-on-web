/**
 * 名称：初始化request上下信息
 * 日期：2017-04-05
 * 描述：在这里可以给Request附加一些全局有用的上下文信息
 */

//引入依赖>>
import appContext from 'app-context';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'

//获取express app对象
const app = appContext.getParam('app');

app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))

//添加request上下文 appContext
app.use((req, resp, next)=>{
    //附加 AppContext属性到request上下
    req.AppContext = appContext;
    next();
});