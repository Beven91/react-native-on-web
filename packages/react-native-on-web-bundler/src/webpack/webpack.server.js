/**
 * 名称：Webpack打包服务端
 * 日期：2016-11-02
 * 描述：用于进行服务端代码打包
 */

// 添加搜索路径
module.paths.unshift(require('path').resolve('node_modules'));

var path = require('path')
var webpack = require('webpack')
var config = require('../rnw-config.js')();
var Options = require('../helpers/options.js');
var ModuleResolver = require('babel-plugin-module-resolver');

// webpack plugins
var NodeModulePlugin = require('webpack-node-module-plugin').NodeModulePlugin
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var CleanWebpackPlugin = require('clean-webpack-plugin')
var PackageJsonPlugin = require('./plugin/package.js');

//babelRc
var babelRc = config.babelRc;
// 代码目录
var contextPath = path.dirname(config.serverContextEntry);
// 服务端打包存放目标目录
var serverAppDir = config.serverAppDir;
// 设置需要设置成externals的node_modules模块
var externalsNodeModules = [
  'react-native',
  'babel-polyfill',
  'babel-runtime',
  'react',
  'react-dom',
  'react-deep-force-update',
  'react-mixin',
  'react-native-on-web'
].concat(config.externalModules)

var baseName = path.relative(config.clientAppDir, serverAppDir);
var targetIndexWeb = path.join(config.clientAppDir, path.dirname(baseName), path.basename(config.serverContextEntry));

var copyBabel = Options.merge({}, config.babelRc);

copyBabel.plugins = [].concat(config.babelRc.plugins);

//服务端babel别名
copyBabel.plugins.unshift([
  'module-resolver', {
    resolvePath(sourcePath, currentFile, opts) {
      var name = ModuleResolver.resolvePath(sourcePath, currentFile, opts);
      if (name) {
        var full = path.join(path.dirname(currentFile), name);
        var name2 = path.relative(config.projectRoot, full);
        return name2.indexOf('..' + path.sep) > -1 ? name.replace('../', '') : name;
      }
    },
    'alias': Options.merge({
      'react-native-on-web-index-web-js': path.relative(path.join(config.releaseDir), targetIndexWeb),
      'react-native-on-web/packager/register': 'path',
      'react-native-on-web/packager/webpack/middleware/hot.bundle.js': 'react-native-on-web/packager/webpack/middleware/bundle.js'
    }, Options.relativeAlias(config.alias, config.projectRoot))
  }
])

module.exports = Options.merge({
  target: 'node',
  mode: 'development',
  stats: config.isDebug ? 'detailed' : 'errors-only',
  name: 'react-native-web server-side', // 配置名称
  context: contextPath, // 根目录
  entry: {
    'server': [
      './' + path.relative(contextPath, config.serverContextEntry).replace(/\\/g, '/')
    ]
  },
  output: {
    // 设置根目录为assets/app目录 目的：打包服务端js时，
    // 产生的资源文件例如：图片 存放到前端资源目录(assets/app)
    // 使资源文件与webpack.client打包位置保持一致
    path: config.clientAppDir,
    // 设置打包服务端js存放目标目录文件名
    filename: baseName + '/[name].js',
    publicPath: config.publicPath,
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(path.basename(config.releaseDir), { exclude: ['assets', 'assets.json', 'spliter.json'], root: path.dirname(config.releaseDir) }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new RequireImageXAssetPlugin(config.imageAssets),
    new NodeModulePlugin(contextPath, config.cdnVariableName, config.releaseDir, copyBabel, config.ignores),
    new PackageJsonPlugin()
  ],
  externals: function (context, request, callback) {
    request = request.trim()
    var isExternal = externalsNodeModules.filter(function (v) { return (request + '/').indexOf(v + '/') == 0; }).length > 0
    return isExternal ? callback(null, 'commonjs ' + request) : callback()
  },
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: [
      {
        // jsx 以及js es6
        test: /\.js$|\.jsx$/,
        loader: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: babelRc.presets,
            plugins: babelRc.plugins,
            babelrc: babelRc.babelrc,
          }
        }],
      },
      {
        // 图片类型模块资源访问
        test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg)$/,
        loader: [
          {
            loader: 'image-web-loader',
            options: config.minOptions
          },
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]'
            }
          }
        ]
      },
      {
        // url类型模块资源访问
        test: new RegExp('\\' + config.static.join('$|\\') + '$'),
        loader: 'url-loader',
        query: {
          name: '[hash].[ext]',
          limit: 10000
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules'].concat(module.paths),
    alias: config.alias,
    extensions: config.extensions
  },
  resolveLoader: {
    modules: module.paths,
  }
}, config.webpack);
