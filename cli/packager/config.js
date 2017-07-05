/**
 * 网站打包配置
 */

// 引入依赖>>
var path = require('path')
var os = require('os')
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
var webConfig = require(path.resolve('web.json'));

// 默认本地图片路径
var imageAssets = [
  path.join(path.resolve(''), '..', 'android/app/src/main/res/drawable/'),
  path.join(path.resolve(''), '..', 'ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
  path.resolve('assets/images')
].concat(customPackager.imageAssets)

var indexWeb = customPackager.serverContextEntry || path.join(rootDir, '../index.web.js');
var indexWebDir = path.dirname(indexWeb);
var babelRc = require('./babelRC.js').getRC(indexWeb)
var publicPath = '/app/';

module.exports = {
  indexWebDir:indexWebDir,
  cdnVariableName: webConfig.cdnVariableName,
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
  targetAppDir: path.join(releaseDir, 'app'),
  // 工程根目录
  rootDir: rootDir,
  // 打包发布后的目录
  releaseDir: releaseDir,
  // 图片寻找默认环境目录
  imageAssets: imageAssets,
  targetNodeModulesDir: targetNodeModulesDir,
  //扩展webpack配置
  webpack: customPackager.webpack,
  // 别名配置
  alias: doAssign(require('./alias.js'), customPackager.alias),
  //服务端同构文件载入实现
  serverResolves: customPackager.serverResolves || {},
  // 扩展名设置
  extensions: babelRc.extensions,
  // 静态资源后缀名
  static: customPackager.static([
    '.bmp', '.ico', '.gif', '.jpg', '.jpeg', '.png', '.psd', '.svg', '.webp', // Image formats
    '.m4v', '.mov', '.mp4', '.mpeg', '.mpg', '.webm', // Video formats
    '.aac', '.aiff', '.caf', '.m4a', '.mp3', '.wav', // Audio formats
    '.html', '.pdf', // Document formats
    '.woff', '.woff2', '.woff', '.woff2', '.eot', '.ttf', //icon font
  ]),
  // 打包复制忽略项
  ignores: ['node_modules/**/*', '.gitignore'].concat(customPackager.ignores),
  // 需要进行路由拆分的loaders
  splitRoutes: customPackager.spliters,
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
