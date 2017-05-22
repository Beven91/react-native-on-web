/**
 * 名称：Webpack打包服务端
 * 日期：2016-11-02
 * 描述：用于进行服务端代码打包
 */

var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var envAdapter = require('../../server/env/enviroment')
var dantejs = require('dantejs')
var config = require('../config.js')
var gracefulFs = require('graceful-fs')
var BabelRCMaker = require('../babelRC.js')

// webpack plugins
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HappyPack = require('happypack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var WebpackShellPlugin = require('webpack-shell-plugin')
var PackageJsonPlugin = require('./plugin/package.js')
var CopyWebpackPlugin = require('copy-webpack-plugin')

gracefulFs.gracefulify(fs)

// 工程根目录
var rootDir = config.rootDir
// app代码根目录
var appDir = path.join(rootDir, 'app')
// 发布目录
var releaseDir = config.releaseDir
// 公用资源存放目录
var assetDir = path.join(releaseDir, 'app')
// babel 配置
var babelRc = BabelRCMaker.getRC()
// 设置需要设置成externals的node_modules模块
var externalsNodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return (!BabelRCMaker.isNodeModuleCompile(x) || ['.bin'].indexOf(x) === -1)
  })
  .forEach(function (mod) {
    externalsNodeModules[mod] = 'commonjs ' + mod
  })

  console.log(Object.keys(externalsNodeModules).length)

module.exports = {
  target: 'node',
  stats: 'errors-only',
  name: 'react-native-web server-side', // 配置名称
  context: appDir, // 根目录
  entry: {
    'server': ['./server.js']
  },
  output: {
    path: path.join(releaseDir, 'assets/app'),
    filename: '../../app/[name].js',
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin([assetDir, config.targetNodeModulesDir]),
    new WebpackShellPlugin({onBuildStart: [config.serverCompile]}),
    new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
    new HappyPack(config.happyPack),
    // new CopyWebpackPlugin(config.serverSideCopy,{copyUnmodified: true,debug:'warning'}),
    new RequireImageXAssetPlugin(config.imageAssets),
    new webpack.NoEmitOnErrorsPlugin(),
    new PackageJsonPlugin()
  ],
  externals: externalsNodeModules,
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
          limit: 10000000000
        }
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
