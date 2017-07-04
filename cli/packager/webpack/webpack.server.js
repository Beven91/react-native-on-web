/**
 * 名称：Webpack打包服务端
 * 日期：2016-11-02
 * 描述：用于进行服务端代码打包
 */

// 添加搜索路径
module.paths.unshift(require('path').resolve('node_modules'));

var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var config = require('../config.js')
var gracefulFs = require('graceful-fs')
var combine = require('../combine.js');
var BabelRCMaker = require('../babelRC.js')

// webpack plugins
var NodeModulePlugin = require('webpack-node-module-plugin').NodeModulePlugin
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HappyPack = require('happypack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var PackageJsonPlugin = require('./plugin/package.js')

gracefulFs.gracefulify(fs)

// 代码目录
var contextPath = path.dirname(config.serverContextEntry)
// 服务端打包存放目标目录
var targetAppDir = config.targetAppDir;
// 设置需要设置成externals的node_modules模块
var externalsNodeModules = fs.readdirSync('node_modules')
  .filter(function (x) {
    return (['.bin'].indexOf(x) === -1 && !BabelRCMaker.isNodeModuleCompile(x))
  }).concat([
    'react-native'
  ])

module.exports = combine({
  target: 'node',
  stats: 'detailed',
  name: 'react-native-web server-side', // 配置名称
  context: contextPath, // 根目录
  entry: {
    'server': ['./' + path.basename(config.serverContextEntry)]
  },
  output: {
    // 设置根目录为assets/app目录 目的：打包服务端js时，
    // 产生的资源文件例如：图片 存放到前端资源目录(assets/app)
    // 使资源文件与webpack.client打包位置保持一致
    path: config.assetsAppDir,
    // 设置打包服务端js存放目标目录文件名
    filename: path.relative(config.assetsAppDir, targetAppDir) + '/[name].js',
    publicPath: config.publicPath,
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin([targetAppDir, config.targetNodeModulesDir], { root: config.releaseDir }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HappyPack(config.happyPack),
    new RequireImageXAssetPlugin(config.imageAssets),
    new NodeModulePlugin(contextPath, config.cdnVariableName, config.releaseDir),
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
    loaders: [
      {
        // jsx 以及js es6
        test: /\.js$|\.jsx$/,
        loader: path.resolve('node_modules/happypack/loader') + '?id=babel',
        exclude: config.babelRc.ignore
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
            loader: 'file-loader'
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
    ].concat(config.loaders)
  },
  resolveLoader: {
    modules: [path.resolve('node_modules')]
  },
  resolve: {
    alias: config.alias,
    extensions: config.extensions
  }
}, config.webpack);
