module.exports = function (app) {
  // 载入依赖>>
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  //客户端热部署...........

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

  //服务端热部署......
  const cache = module.constructor._cache;
  const hotReplaceModule = (m) => {
    delete cache[m.id];
    let children = m.children;
    if (children.length > 0) {
      children.forEach((cm) => hotReplaceModule(cm));
    }
  }
  //创建监听器
  compiler.plugin('watch-run', function (watch, next) {
    let moduleCache = require.cache;
    let id = require.resolve('react-native-on-web-index-web-js');
    let mod = moduleCache[id];
    if (mod) {
      console.log('server-side hot replacing .....');
      hotReplaceModule(mod);
      console.log('server-side hot replaced !');
    }
    next();
  })
}
