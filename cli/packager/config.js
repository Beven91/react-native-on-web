/**
 * 网站打包配置
 */

// 引入依赖>>
var path  =require('path');
var fse = require('fs-extra')
var os = require('os')
var HappyPack = require('happypack')
var Configuration = require('./local-cli/config.js')

// 工程包配置对象
var pgk = require(path.resolve('package.json'))
// babel转码配置
var babelRc = require('./babelRC.js').getRC()
// 命令行发布配置对象
var processConfig = Configuration.get()
// 自定义打包相关配置
var customPackager = processConfig.customConfig

// 工程根目录
var rootDir = customPackager.projectRoot || path.resolve('')
// 发布目录
var releaseDir = processConfig.releaseDir || path.join(rootDir, 'release/react-web/')
// 发布后目标node_modules目录
var targetNodeModulesDir = path.join(releaseDir, 'node_modules')

// 默认本地图片路径
var imageAssets = [
  path.join(path.resolve(''), '..', 'android/app/src/main/res/drawable/'),
  path.join(path.resolve(''), '..', 'ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
  path.resolve('assets/images')
].concat(customPackager.imageAssets)

//资源路径
var publicPath = customPackager.publicPath || '/app/';

module.exports = {
  // webpack静态资源访问目录
  publicPath: publicPath,
  // 客户端代码打包入口
  clientContextEntry: customPackager.clientContextEntry || path.join(rootDir, 'server/react/client.js'),
  // 服务端代码打包入口
  serverContextEntry: customPackager.serverContextEntry || path.join(rootDir, '../index.web.js'),
  // webpack打包静态资源存放目录
  assetsDir: path.join(releaseDir, 'assets'),
  // webpack.client 输出目录
  assetsAppDir: path.join(releaseDir, 'assets', publicPath),
  // 工程根目录
  rootDir: rootDir,
  // 打包发布后的目录
  releaseDir: releaseDir,
  // 图片寻找默认环境目录
  imageAssets: imageAssets,
  targetNodeModulesDir: targetNodeModulesDir,
  // webpack loaders自定义
  loaders: customPackager.loaders || [],
  // webpack plugins 自定义
  plugins: customPackager.plugins || [],
  // 别名配置
  alias: doAssign(require('./alias.js'), customPackager.alias),
  // 扩展名设置
  extensions: customPackager.extensions || [],
  // 服务端打包复制配置
  serverSideCopy: [
     {
      from: path.resolve(''),
      to: releaseDir,toType: 'dir',
      ignore:customPackager.ignoreCopy ||  ['/node_modules/','/logs/','/.happypack/']
    },
    {
      from: path.resolve('node_modules'),
      to: targetNodeModulesDir,toType: 'dir',
      ignore: Object.keys(pgk.devDependencies).map(mapIgnoreNodeModule)
    }
  ].concat(customPackager.copy),
  // 快速构建插件配置
  happyPack: {
    id: 'babel',
    loaders: [{
      path: 'babel-loader',
      query: {
        presets: babelRc.presets,
        plugins: babelRc.plugins
      }
    }],
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
    cache: true,
    verbose: true
  },
  // 图片压缩配置
  minOptions: customPackager.minOptions || {
      contextName: '__cdnUrl__',
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

function mapIgnoreNodeModule (v) {
  return '/' + v + '/'
}

function doAssign (target, source) {
  source = source || {}
  for (var i in source) {
    target[i] = source[i]
  }
  return target
}
