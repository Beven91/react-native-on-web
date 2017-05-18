/**
 * 网站打包配置
 */

// 引入依赖>>
var path = require('path')
var fse = require('fs-extra')
var os = require('os')
var dantejs = require('dantejs')
var HappyPack = require('happypack')

// 工程根目录
var rootDir = path.join(__dirname, '..')
// 发布目录
var releaseDir = path.join(rootDir, '../release/react-web/')
// 服务端express代码目录
var serverDir = path.resolve('server')
var targetServerDir = path.join(releaseDir, 'server')
// pgk
var pgk = require('../package.json')
var babelRc = require('./babelRC.js')

// 依赖模块名称
var dependencies = Object.keys(pgk.dependencies)
var devDependencies = Object.keys(pgk.devDependencies)
var targetNodeModulesDir = path.join(releaseDir, 'node_modules')

// 控制台输入配置
var processArgs = {}
var packagerfile = path.resolve('.packager')
if (fse.existsSync(packagerfile)) {
  processArgs = fse.readJsonSync(packagerfile)
}

// 默认本地图片路径
var imageAssets = [
  path.join(path.resolve(''), '..', 'android/app/src/main/res/drawable/'),
  path.join(path.resolve(''), '..', 'ios/SampleAppMovies/Images.xcassets/AppIcon.appiconset'),
  path.resolve('assets/images')
]

releaseDir = processArgs.releaseDir || releaseDir;

module.exports = {
  // 工程根目录
  rootDir: rootDir,
  // 打包发布后的目录
  releaseDir: releaseDir,
  // 图片寻找默认环境目录
  imageAssets: imageAssets,
  // 需要拆分打包的服务端代码
  serverEntry: {
    'server': ['./server.js'],
    'dantejs': 'dantejs',
    'node-fetch': ['node-fetch'],
    'react': ['react'],
    'react-dom': ['react-dom'],
    'react-native-on-web': ['react-native-on-web'],
    'react-router': ['react-router']
  },
  targetNodeModulesDir: targetNodeModulesDir,
  // 服务端express部分代码babel转码
  serverCompile: dantejs.String.format('babel {0} -D -q --out-dir={1}', serverDir, targetServerDir),
  // 服务端打包复制配置
  serverSideCopy: [
    {
      from: path.resolve('node_modules'),
      to: targetNodeModulesDir,toType: 'dir',
      ignore: devDependencies.map(mapIgnoreNodeModule)
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
