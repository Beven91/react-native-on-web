/**
 * 名称：实现require静态资源加载
 * 日期：2017-04-05
 * 描述：使服务端nodejs支持静态资源文件加载
 */

//引入依赖>>
var fs = require('fs');
var urlloader = require('url-loader');

//获取webpack配置
var webpack = require('../webpack/webpack.client.js');
//静态资源配置
var extensions = ["png","ico","jpg","jpeg","gif","svg","woff","woff2","svg","woff","woff2","eot","ttf"];
//基础路径
var publicPath = webpack.output.publicPath;

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
        emitFile: function() {}
    };
    var exp = urlloader.call(context, buffer);
    var fn = new Function("module,__webpack_public_path__", exp);
    fn(md, publicPath);
};

//批量注册静态资源加载器
extensions.map(function(ext){ require.extensions['.' + ext] = fileResolver;  })