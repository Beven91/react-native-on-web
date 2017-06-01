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
var clientWebpack = require('./webpack.client.js')

// webpack plugins
var NodeModulePlugin  =require('webpack-node-module-plugin').NodeModulePlugin;
var RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HappyPack = require('happypack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var PackageJsonPlugin = require('./plugin/package.js')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var SplitByPathPlugin = require('webpack-split-by-path')

gracefulFs.gracefulify(fs)

// 工程根目录
var rootDir = config.rootDir
//代码目录
var contextPath  =path.join(config.rootDir,'..');
// 发布目录
var releaseDir = config.releaseDir
// 服务端打包存放目标目录
var targetAppDir = path.join(releaseDir, 'app')
// babel 配置
var babelRc = BabelRCMaker.getRC()
// 设置需要设置成externals的node_modules模块
var externalsNodeModules = fs.readdirSync('node_modules')
  .filter(function (x) {
    return (['.bin'].indexOf(x) === -1 && !BabelRCMaker.isNodeModuleCompile(x))
  }).concat([
  'react-native'
])

module.exports = {
  target: 'node',
  stats: 'errors-only',
  name: 'react-native-web server-side', // 配置名称
  context: contextPath, // 根目录
  entry: {
    'server': ['./index.web.js']
  },
  output: {
    // 设置根目录为assets/app目录 目的：打包服务端js时，
    // 产生的资源文件例如：图片 存放到前端资源目录(assets/app)
    // 使资源文件与webpack.client打包位置保持一致
    path: config.assetsAppDir,
    //设置打包服务端js存放目标目录文件名
    filename: path.relative(config.assetsAppDir, targetAppDir) + '/[name].js',
    publicPath: config.publicPath,
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin([targetAppDir, config.targetNodeModulesDir]),
    new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
    new HappyPack(config.happyPack),
    new CopyWebpackPlugin(config.serverSideCopy, {copyUnmodified: true,debug: 'warning'}),
    new RequireImageXAssetPlugin(config.imageAssets),
    new webpack.NoEmitOnErrorsPlugin(),
    new NodeModulePlugin(contextPath),
    new PackageJsonPlugin()
  ],
  externals: function (context, request, callback) {
    request = request.trim()
    var isExternal = context.indexOf(path.resolve('node_modules')) > -1
    isExternal = isExternal || externalsNodeModules.filter(function (v) { return (request+'/').indexOf(v+'/') == 0; }).length > 0
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
