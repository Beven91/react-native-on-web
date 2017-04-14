/**
 * 名称：用于集成webpack打包到badjs-report
 * 日期：2016-11-20
 * 描述：无
 */

function BadjsReportPlugin() {}

BadjsReportPlugin.prototype.apply = function(compiler) {
    compiler.plugin("compilation", function(compilation) {
        compilation.mainTemplate.plugin('startup', function(source, module, hash) {
            if (source.indexOf('__BadjsReport__') === -1) {
                return '(' + badjs.toString() + ')();\n' + source;
            }
            return source;
        });
    });
}

function badjs() {
    var __origin__webpack_require__ = __webpack_require__;
    __webpack_require__ = BJ_REPORT.tryJs().spyCustom(__webpack_require__);
    for (var i in __origin__webpack_require__) {
        __webpack_require__[i] = __origin__webpack_require__[i];
    }
}

module.exports = BadjsReportPlugin;