/**
 * 名称：Webpack打包客户端
 * 日期：2016-11-02
 * 描述：用于进行客户端代码打包，或者开发时使用热部署，进行自动更新
 */

var os = require('os')
var path = require('path')
var fse = require('fs-extra')
var webpack = require('webpack')
var envAdapter = require('../../server/env/enviroment')
var dantejs = require('dantejs')
var config = require('../config.js')
var Arrays = dantejs.Array
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var HappyPack = require('happypack')
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

// 

// 工程根目录
var rootDir = config.rootDir
// app代码根目录
var appDir = path.join(rootDir, 'app')
// 发布目录
var releaseDir = config.releaseDir
// 公用资源存放目录
var assetDir = path.join(releaseDir, 'assets')
// babel 配置
var babelRc = require('../babelRC.js')

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
  name: 'reactWeb', // 配置名称
  context: appDir, // 根目录
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
    path: assetDir,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: [{
        path:'babel-loader',
        query: {
          presets: babelRc.presets,
          plugins: babelRc.plugins
        }
      }],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
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
        loader: 'image-web-loader!file'
      },
      {
        // url类型模块资源访问
        test: /\.(ico|svg|woff|woff2)$/,
        loader: 'url',
        query: {
          name: '[hash].[ext]',
          limit: 10000
        }
      },
      {
        // json类型模块处理
        test: /\.json$/,
        loader: 'json'
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
