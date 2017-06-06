/**
 * 名称：Webpack打包客户端
 * 日期：2016-11-02
 * 描述：用于进行客户端代码打包，或者开发时使用热部署，进行自动更新
 */

// 添加搜索路径
module.paths.unshift(require('path').resolve('node_modules'))

var path = require('path')
var webpack = require('webpack')
var dantejs = require('dantejs')
var config = require('../config.js')
var Arrays = dantejs.Array
var isProudction = process.env.NODE_ENV == 'production'

// webpack plugins
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var HappyPack = require('happypack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

// 工程根目录
var rootDir = config.rootDir
// 发布目录
var releaseDir = config.releaseDir
// 公用资源存放目录
var assetDir = config.assetsDir

// babel 配置
var babelRc = require('../babelRC.js').getRC()

// 开发环境plugins
var devPlugins = [
  new webpack.HotModuleReplacementPlugin()
]

// 生产环境plugins
var proPlugins = [
  new CleanWebpackPlugin(assetDir, {root: config.releaseDir}),
  new CopyWebpackPlugin([{from: path.resolve('assets'),to: assetDir,toType: 'dir'}]),
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
  devtool: isProudction ? 'cheap-module-source-map' : 'eval', // 打包后每个模块内容使用eval计算产出
  name: 'react-native-web client-side', // 配置名称
  context: path.dirname(config.clientContextEntry), // 根目录
  stats: isProudction ? undefined : 'errors-only',
  entry: {
    app: Arrays.filterEmpty([
      './' + path.basename(config.clientContextEntry),
      isProudction ? undefined : 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    ]),
    common: [
      'react',
      'react-dom',
      'react-native-web',
      'react-native-on-web',
      'whatwg-fetch',
      'babel-polyfill'
    ]
  },
  output: {
    path: config.assetsAppDir,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  plugins: [
    new ProgressBarPlugin(),
    new RequireImageXAssetPlugin(config.imageAssets),
    new HappyPack(config.happyPack),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common')
  ]
    .concat(isProudction ? proPlugins : devPlugins)
    .concat(config.plugins),
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
    ].concat(config.loaders)
  },
  resolveLoader: {
    modules: [path.resolve('node_modules')]
  },
  resolve: {
    alias: config.alias,
    extensions: babelRc.extensions.concat(config.extensions)
  }
}
