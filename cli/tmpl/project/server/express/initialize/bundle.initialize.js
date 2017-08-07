/**
 * 名称：初始化开发环境配置
 * 日期：2016-11-25
 * 描述：用于配置开发环境，便利操作
 */

// 引入依赖>>
import appContext from 'app-context';

// 获取express app对象
const app = appContext.getParam('app')

// 开发环境初始化
appContext.onDev(() => {
    require('react-native-on-web/packager/webpack/middleware/hot.bundle.js')(app);
})