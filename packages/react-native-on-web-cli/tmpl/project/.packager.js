var path = require('path')
var webConfig = require('./web.json')

module.exports = {
  targetPort: 8080,
  /**
   * require('image!xx') 寻址目录列表
   * 默认会寻找android或者ios目录或者web目录assets/images下的图片文件
   * 可以追加路径
   */
  imageAssets: [],
  // 静态资源打包后通过express访问的路径前缀  例如: /app/
  publicPath: '/app/',
  // 客户端代码打包入口文件
  clientContextEntry: path.resolve('server/express/react/client.js'),
  // 服务端代码打包入口文件
  serverContextEntry: path.resolve(webConfig.indexWeb),
  //额外配置babelrc 例如: (config)=> ... 或者 {persets:[...]}
  babelrc: {
  },
  //修改webpack配置 例如: (config)=> ... 或者 {loaders:[...]}
  webpack: {
  },
  //服务端同构文件载入实现 例如: {'css':(filename)=>''  }
  serverResolves: {},
  //静态资源设置
  static: function (exts) {
    return exts;
  },
  /**
   * 开发环境是否node_modules下所有文件都使用babel编译
   * 如果设置成true  则无需设置es6Modules 但是会导致开发环境启动速度变慢
   * 如果设置成false 当你的项目的依赖模块是es6的代码 
   * 可以在es6Modules 下设置白名单
   */
  compileAll: true,
  /**
   * node_modules下需要编译成es6的模块
   * 始终包含 /react-native-/ 开头的模块
   * 每个想值为正则表达式 例如: /sherlock-/ 使用babel编译node_modules目录下
   * 所有以sherlock-开头的模块
   */
  es6Modules: [],
  /**
   * 按需加载:
   * 可以根据路由拆分 可以写相对路径（相对于indexWeb所在目录），或者绝对路径
   * 例如: ./routers/user.js
   * 场景：例如使用react-router:
   *      import User from "./routers/user.js"
   *      import Register from "./routers/register.js"
   *      <Router>
   *        <Route  getComponent={User} path="/user" />
   *        <Route  getComponent={Register} path="/register" />
   *      </Router>
   *      那么可以配置splitRouters:
   *      [
   *        './routers/user.js',
   *        './routers/register.js'
   *      ]
   * 那么会打包成
   *      1.user.js
   *      2.register.js
   *      app.js
   *      common.js
   *      1.user.js 当访问/user时进行自动懒加载加载
   * 
   * 配置案例:
   *  格式:  要拆分的js路径?name=路由路径
   *  例如:  ./routers/user/login.js?name=user/login
   *  目的： ?name=user/login 解决代码拆分造成同构checksum问题
   *  原理:  当路由匹配到?name的值，会在同构时同步加载对应拆分的js 如果是客户端pushstate则异步加载
   *  [
   *    'index=user/login', //特殊项 用于配置/对应的路由
   *    './routers/user/login.js?name=user/login'
   *  ]
   */
  spliters:[
  ],
  /** *
   * 代码拆分loader自定义exports
   * 例如: 
   * code:  默认loaders的exports代码字符串
   * filepath: 当前拆分的文件绝对路径
   * function(code,filepath){
   *    return code;
   * }
   */
  splitHandle:null,
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
