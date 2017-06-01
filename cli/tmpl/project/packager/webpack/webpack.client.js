/**
 * 名称：Webpack打包客户端
 * 日期：2016-11-02
 * 描述：用于进行客户端代码打包，或者开发时使用热部署，进行自动更新
 */

var path = require('path')
var webpack = require('webpack')
var envAdapter = require('../../server/env/enviroment')
var dantejs = require('dantejs')
var config = require('../config.js')
var Arrays = dantejs.Array

// webpack plugins
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var HappyPack = require('happypack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')

// 工程根目录
var rootDir = config.rootDir
// 发布目录
var releaseDir = config.releaseDir
// 公用资源存放目录
var assetDir = config.assetsDir;


// babel 配置
var babelRc = require('../babelRC.js').getRC()

// 开发环境plugins
var devPlugins = [
  new webpack.HotModuleReplacementPlugin()
]

// 生产环境plugins
var proPlugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
]

module.exports = {
  devtool: envAdapter.valueOf('eval', undefined), // 打包后每个模块内容使用eval计算产出
  name: 'react-native-web client-side', // 配置名称
  context: config.contextPath, // 根目录
  stats: envAdapter.valueOf('errors-only', undefined),
  entry: {
    app: Arrays.filterEmpty([
      './client.js',
      envAdapter.onDev('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')
    ]),
    common: [
      'dantejs',
      'react',
      'react-dom',
      'react-native-web',
      'react-native-on-web',
      'react-router',
      'whatwg-fetch',
      'babel-polyfill'
    ]
  },
  output: {
    pathinfo:true,
    path: config.assetsAppDir,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  plugins: [
    new ProgressBarPlugin(),
    new HappyPack(config.happyPack),
    new CleanWebpackPlugin(assetDir),
    new CopyWebpackPlugin([{from: path.resolve('assets'),to: assetDir,toType: 'dir'}]),
    new RequireImageXAssetPlugin(config.imageAssets),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common')
  ].concat(envAdapter.valueOf(devPlugins, proPlugins)),
  module: {
    loaders: [
      {
        // jsx 以及js es6
        test: /\.js$|\.jsx$/,
        loader: path.resolve('node_modules/happypack/loader') + '?id=babel',
        exclude: babelRc.ignore
      },
      {
        // 图片类型模块资源访问
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'image-web-loader!file-loader'
      },
      {
        // url类型模块资源访问
        test: /\.(ico|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: '[hash].[ext]',
          limit: 10000
        }
      },
      {
        // json类型模块处理
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolveLoader: {
    modules: [path.resolve('node_modules')]
  },
  resolve: {
    alias: config.alias,
    extensions: babelRc.extensions
  }
}
