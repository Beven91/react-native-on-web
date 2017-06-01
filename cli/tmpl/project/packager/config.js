/**
 * 网站打包配置
 */

// 引入依赖>>
var path = require('path')
var fse = require('fs-extra')
var os = require('os')
var dantejs = require('dantejs')
var HappyPack = require('happypack')
var Configuration = require('./local-cli/config.js');

// 工程包配置对象
var pgk = require('../package.json')
//babel转码配置
var babelRc = require('./babelRC.js').getRC();
//命令行发布配置对象
var processConfig = Configuration.get();

// 工程根目录
var rootDir = path.join(__dirname, '..')
// 发布目录
var releaseDir =processConfig.releaseDir || path.join(rootDir, '../release/react-web/')
// 服务端express代码目录
var serverDir = path.resolve('server')
// 发布后目标服务端代码目录
var targetServerDir = path.join(releaseDir, 'server')
// 发布后目标node_modules目录
var targetNodeModulesDir = path.join(releaseDir, 'node_modules')

// 默认本地图片路径
var imageAssets = [
  path.join(path.resolve(''), '..', 'android/app/src/main/res/drawable/'),
  path.join(path.resolve(''), '..', 'ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
  path.resolve('assets/images')
]

module.exports = {
  //webpack静态资源访问目录
  publicPath: '/app/',
  contextPath:path.join(rootDir,'server/react/'),
  //webpack打包静态资源存放目录
  assetsDir:path.join(releaseDir, 'assets'),
  //webpack.client 输出目录
  assetsAppDir:path.join(releaseDir, 'assets','app'),
  // 工程根目录
  rootDir: rootDir,
  // 打包发布后的目录
  releaseDir: releaseDir,
  // 图片寻找默认环境目录
  imageAssets: imageAssets,
  targetNodeModulesDir: targetNodeModulesDir,
  // 服务端express部分代码babel转码
  serverCompile: dantejs.String.format('babel {0} -D -q --out-dir={1}', serverDir, targetServerDir),
  // 服务端打包复制配置
  serverSideCopy: [
    {
      from: path.resolve('node_modules'),
      to: targetNodeModulesDir,toType: 'dir',
      ignore: Object.keys(pgk.devDependencies).map(mapIgnoreNodeModule)
    }
  ],
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
  // 别名配置
  alias: require('./alias.js')
}

function mapIgnoreNodeModule (v) {
  return '/' + v + '/'
}
