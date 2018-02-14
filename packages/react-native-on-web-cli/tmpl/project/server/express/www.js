/**
 * 名称：react-native web应用程序服务端初始化
 * 日期：2017-04-05 （修改)
 * 描述：
 *      使用express作为服务端程序，
 *      如果需要配置服务端相关信息请更改以下配置
 *      1.静态资源服务
 *      2.日志服务
 *      3.webpack热部署服务
 *      4.react 同构服务
 *      5.视图引擎服务
 *      6.500与404服务
 *      7...其他可以自行扩展....
 */

// 依赖引入
import appContext from 'app-context'
import childProcess from 'child_process'
import express from 'express'
import logger from 'logger'

// 获取webconfig数据
const config = appContext.getParam('web')
// 创建一个网站服务
const app = new express()

// 设置express app
appContext.setParam('app', app)
// 设置react启动appName  如果不传递 ，则默认使用注册第一个app应用程序
appContext.setRunReactAppName()

// fetch跨域配置
require('./initialize/fetch.initialize.js')
// 优先初始化request上下文信息
require('./initialize/context.initialize.js')
// 性能优化初始化
require('./initialize/perfermance.initialize.js')
// 初始化日志配置
require('./initialize/logger.initialize.js')
// 热部署配置
require('./initialize/bundle.initialize.js')
// 初始化静态资源
require('./initialize/static.initialize.js')
// 初始化视图引擎，以及静态资源配置
require('./initialize/view.initialize.js')
// 初始化react配置
require('./initialize/react.initialize.js')
/*----->其他初始化写这里 ----------------->*/
// 初始化网站异常处理
require('./initialize/error.initialize.js')

// 开始监听指定端口
const server = app.listen(config.port, (err) => {
  // 设置express app
  appContext.setParam('server', server)
  if (err) {
    logger.error('Sorry has a error occur!')
    logger.error(err)
  } else {
    let port = server.address().port
    console.log('--------------------------')
    console.log('===> 😊  Starting Server ...')
    console.log(`===>  Environment: ${appContext.env}`)
    console.log(`===>  Listening on port: ${port}`)
    console.log(`===>  Url: http://${appContext.getLocalIP()}:${port}`)
    console.log('--------------------------')
    // 自动使用默认浏览器打开当前网站
    appContext.onDev(() => {
      let opemCmd = process.platform == 'win32' ? 'start' : 'open'
      childProcess.execSync(`${opemCmd} http://localhost:${port}`)
    })
  }
})
