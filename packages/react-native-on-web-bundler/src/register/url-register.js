/**
 * 名称：实现require静态资源加载
 * 日期：2017-04-05
 * 描述：使服务端nodejs支持静态资源文件加载
 */

//引入依赖>>
var fs = require('fs');
var urlloader = require('url-loader');

//全局配置
var config = require('../rnw-config.js');
//基础路径
var publicPath = config.publicPath;
var serverResolves = config.serverResolves;

/**
 * 扩展require.extensions url-loader 的require实现
 * @param md require的module 对象
 * @param filename require的module 对应的文件物理路径
 */
function fileResolver(md, filename) {
    var buffer = fs.readFileSync(filename);
    var context = {
        resourcePath: filename,
        query: '?limit=1',
        options: {},
        emitFile: function () { }
    };
    var exp = urlloader.call(context, buffer);
    var fn = new Function('module,__webpack_public_path__', exp);
    fn(md, publicPath);
}

/**
 * 空处理模块加载函数
 */
function unKnowResolve(md, filename) {
    md.exports = {};
}

require.extensions['.css'] = unKnowResolve;

//批量注册静态资源加载器
config.static.map(function (ext) { (!require.extensions[ext]) && (require.extensions[ext] = fileResolver); });


Object.keys(serverResolves).forEach(function (ext) {
    var handle = serverResolves[ext];
    require.extensions['.' + ext] = function (md, file) {
        md.exports = handle(file);
    }
})
