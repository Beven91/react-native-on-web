/**
 * 名称：Web应用程序主入口
 * 日期：2016-11-02
 * 描述：用于初始化相关环境配置
 */

//启用非打包模式react-native支持
require('react-native-on-web/packager/register');
//开始启动网站
require('./express/www.js');
