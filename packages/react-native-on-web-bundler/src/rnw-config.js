/**
 * 网站打包配置
 */

// 引入依赖>>
var path = require('path')
var fs = require('fs');
var rc = require('./babelRC.js');
var Options = require('./helpers/options')
var Configuration = require('./helpers/configuration');

// 加载自定义配置
var customPackager = Configuration.get()
// 工程根目录
var projectRoot = customPackager.projectRoot || process.cwd();
// 发布目录
var releaseDir = customPackager.releaseDir || path.join(projectRoot, '..', 'release/react-web/')
// 发布后目标node_modules目录
var targetNodeModulesDir = path.join(releaseDir, 'node_modules')
//所有node_modules模块名字列表
var nodeModules = fs.readdirSync(path.join(projectRoot, 'node_modules'));
//index.web.js 文件路径
var indexWeb = customPackager.serverContextEntry || path.join(projectRoot, 'index.web.js');
//babelRc配置
var babelRc = rc.babelRc;
//静态资源url虚拟目录路径
var publicPath = customPackager.publicPath || '/app/';
//静态资源访问cdn变量名 打包后的url cdn +'/app/xxx/s.jpg'  cdn为全局变量名称
var cdnVariableName = customPackager.cdnVariableName || '""';

module.exports = {
  //是否为调试模式 调试模式会输出webpack详细信息
  isDebug: customPackager.isDebug,
  //index.web.js所在目录
  indexWebDir: path.dirname(indexWeb),
  //cdn全局变量名称
  cdnVariableName: cdnVariableName,
  //babel 编译配置
  babelRc: Options.assign({}, babelRc),
  //发布后的启动端口 可以不填写 默认根据web.json的port
  targetPort: customPackager.targetPort,
  // webpack静态资源访问目录
  publicPath: publicPath,
  // 客户端代码打包入口
  clientContextEntry: customPackager.clientContextEntry,
  // 服务端代码打包入口
  serverContextEntry: indexWeb,
  // webpack打包静态资源存放目录
  assetsDir: path.join(releaseDir, 'assets'),
  // webpack.client 输出目录
  assetsAppDir: path.join(releaseDir, 'assets', publicPath),
  // 服务端打包目标目录
  targetAppDir: releaseDir,
  // 工程根目录
  projectRoot: projectRoot,
  // 打包发布后的目录
  releaseDir: releaseDir,
  // 服务端打包是否复制node_modules到目标目录
  copyNodeModules: customPackager.copyNodeModules || false,
  //目标node_modules目录
  targetNodeModulesDir: targetNodeModulesDir,
  //扩展webpack配置
  webpack: customPackager.webpack,
  // 别名配置
  alias: customPackager.alias,
  //服务端同构文件载入实现
  serverResolves: customPackager.serverResolves || {},
  // 扩展名设置
  extensions: babelRc.extensions,
  // 需要进行路由拆分的loaders
  splitRoutes: customPackager.spliters,
  //代码拆分loader自定义处理
  splitHandle: customPackager.splitHandle,
  // 打包复制忽略项
  ignores: ['node_modules/**/*', '.gitignore'].concat(customPackager.ignores),
  //common模块
  commonChunks: [
    'babel-polyfill',
    'react',
    'react-dom',
    'react-native-on-web'
  ].concat(customPackager.commonChunks||[]),
  // 静态资源后缀名
  static: customPackager.static([
    '.bmp', '.ico', '.gif', '.jpg', '.jpeg', '.png', '.psd', '.svg', '.webp', // Image formats
    '.m4v', '.mov', '.mp4', '.mpeg', '.mpg', '.webm', // Video formats
    '.aac', '.aiff', '.caf', '.m4a', '.mp3', '.wav', // Audio formats
    '.html', '.pdf', // Document formats
    '.woff', '.woff2', '.woff', '.woff2', '.eot', '.ttf', //icon font
  ]),
  // 图片寻找默认环境目录
  imageAssets: [
    path.join(projectRoot, '..', 'android/app/src/main/res/drawable/'),
    path.join(projectRoot, '..', 'ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
    path.join(projectRoot, 'assets/images')
  ].concat(customPackager.imageAssets),
  //服务端打包需要忽略的模块
  externalModules: nodeModules.filter(function (x) {
    return (['.bin'].indexOf(x) === -1 && !rc.include2(x))
  }),
  // 图片压缩配置
  minOptions: customPackager.minOptions || {
    contextName: cdnVariableName,
    gifsicle: {
      interlaced: false
    },
    optipng: {
      optimizationLevel: 7
    },
    pngquant: {
      quality: '65-90',
      speed: 4
    },
    mozjpeg: {
      progressive: true,
      quality: 65
    }
  }
}
