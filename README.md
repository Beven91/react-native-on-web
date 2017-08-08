## react-native-on-web 

[![NPM version][npm-image]][npm-url]




### 一、简介篇

  <p>使React-Native 支持Web平台开发</p>
  <p>同时支持React同构模式，以及支持单页模式与多页模式共存，资源按需加载等。 </p>
  <p>自带fetch 支持跨域</p>
  
  基于 [ `react-native-web` ](https://github.com/necolas/react-native-web)





### 二、安装篇

    npm install react-native-on-web
     



### 三、生成篇

安装cli

    npm install react-native-on-web-cli -g

切换到react-native工程根目录下：    
 
- 初始化(生成web平台)

        react-native-on-web init  
    
- 启动(启动web平台)

        react-native-on-web start  
    
- 移除(移除web平台)

        react-native-on-web remove 
    
- 发布(发布web平台)

        react-native-on-web bundle d:/release/

- 升级(升级react-native-on-web)(从2.0.29开始支持)

        react-native-on-web upgrade 

- 查看帮助

        react-native-on-web




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
    * 每项为正则表达式 例如: /sherlock-/ 使用babel编译node_modules目录下
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



### 五、.babelrc 与webpack.js篇

<p>默认打包工具会识别index.web.js所在目录下的.babelrc 以及webpack.js 的配置，</p>
<p>并且将配置合并到打包工具中，</p>
<p>当然大部分是使用.packager.js中的{webpack:{},babelrc:{}}</p>


### 六、平台环境篇

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



### 七、全局对象篇：

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



### 八、关于路由接入篇

默认 `react-native-on-web` 生成的工程，没有路由，
如果需要接入路由可以使用一些能在三端使用的路由
例如：`react-navigation` `react-router`等
<p>路由接入需要考虑两个方向:</p>


**一、服务端路由工作**

默认接入路由有React部分进行路由配置，以及路由匹配
只需要在React路由匹配成功部分执行以下部分就可以达到SSR(Server Side Render)部分
标题以及状态等信息配置



> **关键代码**
```js

const reactAppContext = global['@@__reactAppContext__@@'];

//在路由之间匹配成功后调用
reactAppContext.route.setMatchRoute(props.title,props.initialState);

```
    
> **React-Navigation 接入示例**

```js

import React from 'react-native';
import { IndexScreen, LoginScreen } from './routers';
import { TabRouter , createNavigator, addNavigationHelpers } from 'react-navigation';

const reactAppContext = global['@@__reactAppContext__@@'];
//判断是否为nodejs服务端运行react
const isNodeServerRuntime =  global.__CLIENT__ !== true

//自定义路由组件
class SSRNavigator = (routeConfigs, stackConfig)=>{
    //如果需要进行服务端与客户端区分可以使用如下代码进行变更
    //const NavContainer = isNodeServerRuntime? ServerNavContainer: BrowserNavContainer;
    return createNavigator(TabRouter(routeConfigs, stackConfig))(NavigationContainer);
}

//自定义路由组件View    
class NavigationContainer extends React.Component {
    constructor (props) {
        super(props)
    } 
    render(){
        const { navigation, router } = this.props;
        const state = navigation.state;
        //获取当前需要显示的组件
        const Screen = router.getComponentForState(state)
        //创建新的navigation
        const childNavigation = addNavigationHelpers({
            ...navigation,
            state: state.routes[state.index],
        });
        //获取当前路由对应的Options
        const options =  router.getScreenOptions(navigation2);
        //这里执行服务端数据传递 传递当前路由对应页面标题 以及相关数据
        reactAppContext.route.setMatchRoute(options.title);
        //返回渲染组件
        return (<Screen navigation={childNavigation} />)
    }
}

//配置路由
const NavigatorApp = SSRNavigator({
    Index: {
        screen: IndexScreen,
        path: '',
        navigationOptions: {
        title: '首页'
        }
    },
    Login: {
        screen: LoginScreen,
        path: 'login',
        navigationOptions: {
        title: '登陆'
        }
    }
});

//注册入口
React.AppRegistry.registerComponent('demo', () => NavigatorApp);

```

**二、客户端路由工作**

默认无需进行特殊处理 如果需要进行客户特殊处理，可以参见 上述例子使用 `isNodeServerRuntime`
来分别使用不同的NavigatorView进行处理，当然如果使用`react-router`则可以用来区分不同的history等




### 九、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。

[npm-url]: https://www.npmjs.com/package/react-native-on-web
[npm-image]: https://img.shields.io/npm/v/react-native-on-web.svg
