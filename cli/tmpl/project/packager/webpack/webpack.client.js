/**
 * 名称：Webpack打包客户端(开发环境配置)
 * 日期：2016-11-02
 * 描述：用于开发时进行客户端代码打包，使用热部署，进行自动更新
 */

var path = require('path')
var fse = require('fs-extra')
var webpack = require('webpack')
var envAdapter = require('../../server/env/enviroment')
var Dantejs = require('dantejs')
var Arrays = Dantejs.Array

// 工程根目录
var rootDir = path.resolve('');
// app代码根目录
var appDir = path.join(rootDir, 'app')
// 发布目录
var releaseDir = path.resolve('release/node-msites')
// 公用资源存放目录
var assetDir = path.join(releaseDir, 'assets')
// babel 配置
var babelRc = fse.readJsonSync(path.resolve('.babelrc'))

// 开发环境plugins
var devPlugins = [
  new webpack.HotModuleReplacementPlugin()
]

// 生产环境plugins
var proPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
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
  name: 'msites', // 配置名称
  context: appDir, // 根目录
  entry: {
    app: Arrays.filterEmpty([
      './client.js',
      envAdapter.onDev('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')
    ]),
    common: [
      'babel-polyfill',
      'dantejs',
      'react',
      'react-dom',
      'react-native-web',
      'react-native-on-web',
      'react-router',
      'whatwg-fetch'
    ]
  },
  output: {
    devAssets:path.join(rootDir,'assets'),
    path: assetDir,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  // new BadjsReportPlugin()
  ].concat(envAdapter.valueOf(devPlugins, proPlugins)),
  module: {
    loaders: [
      // jsx 以及js es6
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: babelRc.presets,
          plugins: babelRc.plugins
        }
      },
      // 图片类型模块资源访问
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'image-web-loader!file'
      },
      // url类型模块资源访问
      {
        test:  /\.(ico|svg|woff|woff2)$/,
        loader: 'url',
        query: {
          name: '[hash].[ext]',
          limit: 10000
        }
      },
      // json类型模块处理
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    alias: {
      'NativeModules': path.resolve('node_modules/react-native-on-web'),
      'react-native': path.resolve('node_modules/react-native-on-web'),
      'logger': path.resolve('server/logger'),
      'app-context': path.resolve('server/env/enviroment.js'),
      'babel-polyfill': path.resolve('node_modules/babel-polyfill'),
      'dantejs': path.resolve('node_modules/dantejs'),
      'react': path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
      'react-native-web': path.resolve('node_modules/react-native-web'),
      'react-router': path.resolve('node_modules/react-router'),
      'whatwg-fetch': path.resolve('node_modules/whatwg-fetch')
    },
    extensions: ['', '.js', '.jsx', '.web.js']
  }
}
