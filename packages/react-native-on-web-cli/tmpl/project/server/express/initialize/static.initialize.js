/**
 * 名称：初始化网站静态资源服务
 * 日期：2017-04-05
 * 描述：使用express自带的static服务提供
 */

//引入依赖>>
import path from 'path';
import express from 'express'
import appContext from 'app-context';

//获取express app对象
const app = appContext.getParam('app');

// 设置静态资源目录
app.use(express.static(path.resolve('assets/')));