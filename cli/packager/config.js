/**
 * 网站打包配置
 */

// 引入依赖>>
var path = require('path')
var os = require('os')
var fs = require('fs');
var rc = require('./babelRC.js');
var HappyPack = require('happypack')
var Configuration = require('./local-cli/config.js')

// 命令行发布配置对象
var processConfig = Configuration.get()
// 自定义打包相关配置
var customPackager = processConfig.customConfig
// 工程根目录
var rootDir = customPackager.projectRoot || path.resolve('')
// 发布目录
var releaseDir = processConfig.releaseDir || path.join(rootDir, '..', 'release/react-web/')
// 发布后目标node_modules目录
var targetNodeModulesDir = path.join(releaseDir, 'node_modules')
//所有node_modules模块名字列表
var nodeModules = fs.readdirSync(path.resolve('node_modules'));
//web.json配置
var webConfig = require(path.resolve('web.json'));
var indexWeb = customPackager.serverContextEntry || path.join(rootDir, '../index.web.js');
var indexWebDir = path.dirname(indexWeb);
var babelRc = rc.babelRc;
var publicPath = '/app/';

module.exports = {
  //是否为调试模式 调试模式会输出webpack详细信息
  isDebug: customPackager.isDebug,
  //index.web.js所在目录
  indexWebDir: indexWebDir,
  //cdn全局变量名称
  cdnVariableName: webConfig.cdnVariableName,
  //babel 编译配置
  babelRc: doAssign({}, babelRc),
  //发布后的启动端口 可以不填写 默认根据web.json的port
  targetPort: customPackager.targetPort,
  // webpack静态资源访问目录
  publicPath: publicPath,
  // 客户端代码打包入口
  clientContextEntry: customPackager.clientContextEntry || path.join(rootDir, 'server/express/react/client.js'),
  // 服务端代码打包入口
  serverContextEntry: indexWeb,
  // webpack打包静态资源存放目录
  assetsDir: path.join(releaseDir, 'assets'),
  // webpack.client 输出目录
  assetsAppDir: path.join(releaseDir, 'assets', publicPath),
  // 服务端打包目标目录
  targetAppDir: releaseDir,
  // 工程根目录
  rootDir: rootDir,
  // 打包发布后的目录
  releaseDir: releaseDir,
  //目标node_modules目录
  targetNodeModulesDir: targetNodeModulesDir,
  //扩展webpack配置
  webpack: customPackager.webpack,
  // 别名配置
  alias: doAssign(require('./alias.js'), customPackager.alias),
  //服务端同构文件载入实现
  serverResolves: customPackager.serverResolves || {},
  // 扩展名设置
  extensions: babelRc.extensions,
  // 需要进行路由拆分的loaders
  splitRoutes: customPackager.spliters,
  //代码拆分loader自定义处理
  splitHandle:customPackager.splitHandle,
  // 打包复制忽略项
  ignores: ['node_modules/**/*', '.gitignore'].concat(customPackager.ignores),
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
    path.join(path.resolve(''), '..', 'android/app/src/main/res/drawable/'),
    path.join(path.resolve(''), '..', 'ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
    path.resolve('assets/images')
  ].concat(customPackager.imageAssets),
  //服务端打包需要忽略的模块
  externalModules: nodeModules.filter(function (x) {
    return (['.bin'].indexOf(x) === -1 && !rc.include(x))
  }),
  // 快速构建插件配置
  happyPack: {
    id: 'happybabel',
    loaders: [
      require.resolve('./sourcemap.js'),
      {
        loader: 'babel-loader',
        options: {
          presets: babelRc.presets,
          plugins: babelRc.plugins
        }
      }],
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
    cache: false,
    verbose: true
  },
  // 图片压缩配置
  minOptions: customPackager.minOptions || {
    contextName: webConfig.cdnVariableName,
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

function doAssign(target, source) {
  source = source || {}
  for (var i in source) {
    target[i] = source[i]
  }
  return target
}
