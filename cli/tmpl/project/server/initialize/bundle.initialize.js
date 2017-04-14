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
    // 载入依赖>>
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')

    // 读取webpack配置文件
    let webpackConfig = require('../../packager/webpack/webpack.client.js')
        // 创建一个webpack编译器
    let compiler = new webpack(webpackConfig)
        // 添加webpack打包服务中间件到app中
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }))

    // 添加webpack热部署中间件到app中
    app.use(webpackHotMiddleware(compiler))
})