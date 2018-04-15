/**
 * 名称：webpack使用eval打包后 异常捕获插件
 * 日期：2017-06-21
 * 描述:
 *      通常在webpack使用eval模式打包后，在模块中出现错误，
 *      如果需要全局捕获异常可能会获取到Script.error
 *      使用此插件将默认捕获所有require模块的异常，并且支持全局自定义
 *      异常接收函数进行异常处理
 *      全局异常接收函数定义:
 *      window.onWebpackRequireErrorCapture  =function(error){  console.error(error) }
 *      如果没有设置全局异常监听函数，默认会直接抛出异常
 */

/**
 * 插件构造函数
 */
function RuntimeCapturePlugin() {
}

/**
 * 插件执行入口
 */
RuntimeCapturePlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.mainTemplate.plugin('startup', function (source, module, hash) {
      if (source.indexOf('originWebpackRequire') === -1) {
        return '(' + errorCapture.toString() + ')();\n' + source;
      }
      return source;
    });
  });
}

/**
 * 自定义捕获函数
 */
function errorCapture() {
  var originWebpackRequire = __webpack_require__;
  function captureRequire() {
    try {
      return originWebpackRequire.apply(this, arguments);
    } catch (error) {
      if (typeof window !=='undefined' && typeof window.onWebpackRequireErrorCapture == 'function') {
        return window.onWebpackRequireErrorCapture(error);
      } else {
        console.error(error)
      }
    }
  }
  for (var i in originWebpackRequire) {
    captureRequire[i] = originWebpackRequire[i];
  }
  __webpack_require__ = captureRequire;
}

//公布插件
module.exports = RuntimeCapturePlugin;