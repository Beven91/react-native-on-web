var path = require('path')
var webConfig = require('./web.json')

module.exports = {
  // require('image!xx') 寻址目录列表
  imageAssets: [],
  // 静态资源打包后通过express访问的路径前缀  例如: static/
  publicPath: '/app/',
  // 客户端代码打包入口文件
  clientContextEntry: path.resolve('server/express/react/client.js'),
  // 服务端代码打包入口文件
  serverContextEntry: path.resolve(webConfig.indexWeb),
  // 别名配置
  alias: {
    'logger': path.resolve('server/framework/logger/index.js'),
    'app-context': path.resolve('server/framework/env/enviroment.js')
  },
  // 发布忽略列表
  ignores: [
    '.git/**/*',
    '.packager',
    '.vscode/**/*',
    '.happypack/**/*',
    'logs/**/*'
  ],
  // 图片压缩配置
  minOptions: {
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
