## react-native-on-web

### 一、简介

    使React-Native 支持Web平台开发

    同时支持React同构模式，以及支持单页模式与多页模式共存，资源按需加载等。 

    自带fetch 支持跨域


### 二、安装

    npm install react-native-on-web --g
    
     
### 三、生成

    react-native-on-web init //在你的react-native目录下执行此命令 -> 生成web平台

    react-native-on-web start //在你的react-native目录下执行此命令 -> 启动web平台

    react-native-on-web remove //在你的react-native目录下执行此命令 -> 移除web平台

    react-native-on-web bundle --releaseDir=d:/release/  打包发布到指定目录下

    react-native-on-web update //更新web平台react-native-on-web (从2.0.29开始支持)


### 四、关于.packager.js

    {
        // require('image!xx') 寻址目录列表
        imageAssets: [],
        // 静态资源打包后通过express访问的路径前缀  例如: static/
        publicPath: '/app/',
        // 客户端代码打包入口文件
        clientContextEntry: path.resolve('server/express/react/client.js'),
        // 服务端代码打包入口文件
        serverContextEntry: path.resolve(webConfig.indexWeb),
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
        * 需要进行以路由拆分的文件列表 可以写相对路径（相对于indexWeb所在目录），或者绝对路径
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
        *      1.user.js 再访问当前路由时进行自动懒加载加载
        */
        splitRoutes: [],
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

### 五、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。