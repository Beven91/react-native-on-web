/**
 * 名称：Webpack打包客户端
 * 日期：2016-11-02
 * 描述：用于进行客户端代码打包，或者开发时使用热部署，进行自动更新
 */

// 添加搜索路径
module.paths.unshift(require('path').resolve('node_modules'));

let path = require('path');
let webpack = require('webpack');
let dantejs = require('dantejs');
let config = require('../rnw-config.js')();
let Options = require('../helpers/options');
let Arrays = dantejs.Array;

// webpack plugins
let RequireImageXAssetPlugin = require('image-web-loader').RequireImageXAssetPlugin;
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let RuntimeCapturePlugin = require('./plugin/capture.js');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let AssetsPlugin = require('./plugin/assets');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CodeSpliterPlugin = require('webpack-code-spliter').CodeSpliterPlugin;
let Split = CodeSpliterPlugin.configure(config.splitRoutes, config.indexWebDir, 'pages', config.splitHandle);

let isProudction = process.env.NODE_ENV === 'production';
// 是否为同构模式
let isomorphic = config.isomorphic;
let noop = function () { };
// 开发环境plugins
let devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
];

// 生产环境plugins
let proPlugins = [
  new AssetsPlugin(),
  new CleanWebpackPlugin('*', { root: config.clientAppDir }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
  }),
];

module.exports = Options.merge({
  devtool: 'source-map',
  mode: isProudction ? 'production' : 'development',
  name: 'react-native-web client-side', // 配置名称
  context: path.dirname(config.clientContextEntry), // 根目录
  stats: { children: false, chunks: false, assets: false, modules: false },
  entry: {
    app: Arrays.filterEmpty([
      isProudction ? undefined : 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      './' + path.basename(config.clientContextEntry),
    ]),
  },
  output: {
    path: path.join(config.clientAppDir),
    filename: isProudction ? '[name]-[hash].js' : '[name].js',
    chunkFilename: isProudction ? '[name]-[chunkhash].js' : '[name].js',
    publicPath: config.publicPath,
  },
  optimization: {
    splitChunks: {
      name: 'app',
      chunks: 'initial',
    },
  },
  plugins: [
    (
      isomorphic ?
        noop :
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.resolve('www/express/views/index.cshtml'),
        })
    ),
    new webpack.ProgressPlugin(),
    new RequireImageXAssetPlugin(config.imageAssets),
    new RuntimeCapturePlugin(),
    new CodeSpliterPlugin(isProudction ? config.releaseDir : null),
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(isProudction),
      'process.env': {
        RNW_RUNTIME: JSON.stringify('Client'),
        NODE_ENV: JSON.stringify(isProudction ? 'production' : 'development'),
      },
    }),
  ].concat(isProudction ? proPlugins : devPlugins),
  module: {
    rules: [
      {
        // jsx 以及js es6
        test: /\.js$|\.jsx$/,
        loader: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: config.babelRc.presets,
            plugins: config.babelRc.plugins,
            babelrc: config.babelRc.babelrc,
          },
        }],
        exclude: config.rc.exclude,
      },
      {
        // 代码拆分
        test: /\.js$|\.jsx$/,
        include: Split.includes,
        loader: [
          {
            loader: Split.loader,
            options: Split.options,
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: config.babelRc.presets,
              plugins: config.babelRc.plugins,
              babelrc: config.babelRc.babelrc,
            },
          },
        ],
      },
      {
        // 图片类型模块资源访问
        test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg)$/,
        loader: [
          {
            loader: 'image-web-loader',
            options: config.minOptions,
          },
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]',
            },
          },
        ].filter(function (v) {
          return !!v;
        }),
      },
      {
        // url类型模块资源访问
        test: new RegExp('\\' + config.static.join('$|\\') + '$'),
        loader: 'url-loader',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'].concat(module.paths),
    alias: config.alias,
    extensions: config.extensions,
  },
  resolveLoader: {
    modules: module.paths,
  },
}, config.webpack);
