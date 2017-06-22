/**
 * 名称：站点性能优化
 * 日期：2017-04-05
 * 描述：启用gzip压缩等，后续可以在此扩展
 */

//引入依赖>>
import compression from 'compression'
import appContext from 'app-context';

//获取express app对象
const app = appContext.getParam('app');

// 启用压缩 gzip
app.use(compression());