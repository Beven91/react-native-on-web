## rnw-bundler

[![NPM version][npm-image]][npm-url]

### 一、简介篇

react-native-on-web SSR打包工具，使用webpack
分别打包Server Side 以及 Client Side两端代码。

默认支持如下打包功能:

- SSR(Server Side Render)代码拆分  [ `webpack-code-spliter` ](https://github.com/Beven91/webpack-code-spliter)

- 图片压缩(PNG,GIF,JPG)以及高清方案 [ `image-web-loader` ](https://github.com/Beven91/image-web-loader)

- 模块别名

- 静态资源require

- 服务端渲染控制 serverResolves

- 自定义webpack,babelrc

- 默认presets react-native

- 服务端无合并打包(即 打包后产出原始目录结构方便线上调试)[ `webpack-node-module-plugin`](https://github.com/Beven91/webpack-node-module-plugin)

- 客户端全局require.error捕获函数(window.onWebpackRequireErrorCapture)


### 二、安装篇

    npm install react-native-web-bundler
    
     
### 三、打包篇

```js

const Pack = require('react-native-web-bundler');

//自定义打包配置文件，默认为process.cwd()/.packager.js
const configPath = path.resolve('.packager.js');
//是否打包同构(SSR)server部分
const bundleServer = true;
//是否打包客户端部分
const bundleClient = true;

//执行打包
Pack.runPack(configPath,bundleServer,bundleClient)

```

### 四、.packager.js篇

```js
  {
      targetPort: 8080,
      /**
      * require('image!xx') 寻址目录列表
      * 默认会寻找android或者ios目录或者web目录assets/images下的图片文件
      * 可以追加路径
      */
      imageAssets: [],
      // 客户端代码打包入口文件
      clientContextEntry: path.resolve('index.web.js'),
      // 服务端代码打包入口文件
      serverContextEntry: '....',
      // 服务端打包是否复制node_modules到目标目录
      copyNodeModules:true,
      //额外配置babelrc 例如: (config)=> ... 或者 {persets:[...]}
      babelrc: {
      },
      //修改webpack配置 例如: (config)=> ... 或者 {loaders:[...]}
      webpack:{
      },
        //服务端同构文件载入实现 例如: {'css':(filename)=>''  }
      serverResolves: {},
      /*
        静态资源设置 指定那些后缀为静态资源 默认值：
        [
          '.bmp', '.ico', '.gif', '.jpg', '.jpeg', '.png', '.psd', '.svg', '.webp', // Image formats
          '.m4v', '.mov', '.mp4', '.mpeg', '.mpg', '.webm', // Video formats
          '.aac', '.aiff', '.caf', '.m4a', '.mp3', '.wav', // Audio formats
          '.html', '.pdf', // Document formats
          '.woff', '.woff2', '.woff', '.woff2', '.eot', '.ttf', //icon font
      ]
      */
      static: function (exts) {
          exts.push('.xx');
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
      * 路由资源按需加载:
      * 配置案例:
      *  格式:  path?name=routePath
      *  path: 要拆分的js 相对路径为相对于(index.web.js所在目录) 例如: ./routers/user/login.js
          name: 制定在那个url.pathname下加载 例如: /user/login
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
      * 控制具体要拆分的每个文件的exports部分，
      * 可用来进行额外的拆分模块加载方案配置
      * 例如: 
      * code: 默认loaders的exports代码字符串
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

```

### 五、.babelrc 与webpack.js

在.packager.js中没有设置webpack或者babelrc的情况下:

打包工具默认会合并index.web.js所在目录下的.babelrc文件以及webpack.js文件的配置。

### 六、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。

[npm-url]: https://www.npmjs.com/package/rnw-bundler
[npm-image]: https://img.shields.io/npm/v/rnw-bundler.svg