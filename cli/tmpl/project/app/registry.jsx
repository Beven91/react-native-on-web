/**
 * 名称：用户获取AppRegistry注册应用程序，获取当前web平台注册的app必要信息
 * 日期：2017-04-14
 * 描述：
 */

import React from 'react'
import { Route } from 'react-router'
import { AppRegistry } from 'react-native'

class DefaultComponent extends React.Component {

}

export default class WebAppRegistry {

  /**
   * 获取指定名称的应用程序
   * @param appName 应用程序名称
   */
  static getApplication (appName) {
    //appName 默认处理
    appName = appName || AppRegistry.getAppKeys()[0];
    //获取当前要启动的React-Native应用程序
    const registerApplication = AppRegistry.getApplication(appName)
    // 要启动的App组件
    const registerComponent = registerApplication.element.props.rootComponent
    // 设置路由
    const registerRoutes = registerApplication.routers || (<Route path='/' key='index' component={DefaultComponent}></Route>)
    // 返回component 与routers
    return {registerComponent,registerRoutes}
  }
}
