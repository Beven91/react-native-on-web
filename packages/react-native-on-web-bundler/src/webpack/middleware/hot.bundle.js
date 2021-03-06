module.exports = function (app, configPath, releaseDir) {
  // 载入依赖>>
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const Configuration = require('../../helpers/configuration');

  Configuration.session(configPath, releaseDir);
  // 客户端热部署...........
  // 读取webpack配置文件
  let webpackConfig = require('../webpack.client.js');
  // 创建一个webpack编译器
  let compiler = webpack(webpackConfig);
  // 添加webpack打包服务中间件到app中
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    stats: compiler.options.stats,
    serverSideRender: true,
    publicPath: webpackConfig.output.publicPath,
  }));

  // 添加webpack热部署中间件到app中
  app.use(webpackHotMiddleware(compiler));

  // 附加assets
  app.use(function (req, resp, next) {
    const assetsByChunkName = resp.locals.webpackStats.toJson().assetsByChunkName;
    const assets = [];
    Object
      .keys(assetsByChunkName)
      .map((k) => assets.push(...normalizeAssets(assetsByChunkName[k])));
    resp.locals.Webpack = {
      cssAssets: findAssets(assets, '.css'),
      jsAssets: findAssets(assets, '.js'),
    };
    next();
  });

  // 服务端热部署......
  const cache = module.constructor._cache;
  // 创建监听器
  compiler.hooks.invalid.tap('watch', function (file) {
    let id = require.resolve(file);
    delete cache[id];
  });

  function findAssets(assets, type) {
    const reg = new RegExp(`\\${type}$`);
    return assets
      .filter((path) => reg.test(path))
      .map((path) => webpackConfig.output.publicPath + path);
  }

  function normalizeAssets(assets) {
    return Array.isArray(assets) ? assets : [assets];
  }
};
