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
        clientContextEntry: path.resolve('server/express/react/client.js'),
        // 服务端代码打包入口文件
        serverContextEntry: path.resolve(webConfig.indexWeb),
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

### 五、平台环境

```js
    import {Platform} from "react-native";

    //使用此表达式来判断平台 
    Platform.OS == 'web'

    //使用此表达式来判断是服务端还是浏览器端
    const isBrowserRuntime = global.__CLIENT__ ===true

    //关于文件，跟react-native一致 ，增加.web.js后缀判断 例如:
    Button.web.js
    Navigation.web.js
    
```
    
### 五、全局对象：

```js
    const reactAppContext = global['@@__reactAppContext__@@']

    reactAppContext:{
      //当前访问url.pathname
      routePath: '', 
      //当前访问路由信息(如果在客户端等同于routePath 如果在服务端则为SlideRoute实例)
      route: new SideRoute(),
      //初始化状态
      initialState: {
      }
    }

    //服务端route:
    SlideRoute:{
        //获取或者设置当前路由的标题，
        title:'xxx',
        /**
         * 当自定义路由匹配完成后，可以调用此函数来通知express路由匹配结果
         * 以及当前页面的标题，与initialState数据
         */
        setMatchRoute:function(title,initialState) 
    }

```


### 六、关于路由接入

    默认react-native-on-web生成的工程，没有路由，

    如果需要接入路由可以使用一些能在三端使用的路由

    例如：react-navigation react-router等

    路由接入需要考虑两个方向：

    1.服务端路由工作：

```js

    const reactAppContext = global['@@__reactAppContext__@@'];

    //在路由之间匹配成功后调用
    reactAppContext.route.setMatchRoute(props.title,props.initialState);

```
     
    例如:react-navigation:

```js
         class NavigationContainer extends React.Component {
            constructor (props) {
                super(props)
                const navigation = this.props.navigation;
                const state = navigation.state;
                const navigation2 = addNavigationHelpers({
                    state: state.routes[state.index],
                    dispatch: navigation.dispatch,
                });
                const options =  NodeRuntimeNavView.router.getScreenOptions(navigation2);
                //这里执行服务端数据传递 传递当前路由对应页面标题 以及相关数据
                reactAppContext.route.setMatchRoute(options.title);
            } 
            ....
         }
```

    2.客户端路由工作：

    默认无需进行特殊处理

### 七、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。