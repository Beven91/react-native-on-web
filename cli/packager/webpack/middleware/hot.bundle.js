module.exports = function (app) {
  // 载入依赖>>
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  // 读取webpack配置文件
  let webpackConfig = require('../webpack.client.js')
  // 创建一个webpack编译器
  let compiler = new webpack(webpackConfig)
  // 添加webpack打包服务中间件到app中
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  // 添加webpack热部署中间件到app中
  app.use(webpackHotMiddleware(compiler))
}
