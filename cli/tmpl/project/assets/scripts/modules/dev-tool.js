/**
 * 名称：简单异常捕获调试工具
 * 日期：2016-12-25
 * 描述：
 */
(function () {
    function CustomLocalStorage() {

    }

    CustomLocalStorage.prototype.getItem = function (name) {
        return '';
    }

    CustomLocalStorage.prototype.setItem = function (name, value) {
        return '';
    }

    CustomLocalStorage.prototype.getStorage = function () {
        return this.isStorageSupported() ? window.localStorage : this;
    }

    CustomLocalStorage.prototype.isStorageSupported = function () {
        var testKey = 'supoort';
        var storage = window.localStorage;
        try {
            storage.setItem(testKey, 'true');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    window.localStorage2 = new CustomLocalStorage();//null

}());

(function () {

    //设置
    var canClick = false;

    var localStorage2 = window.localStorage2;

    var localStorage = localStorage2.getStorage();

    /**
     * 异常捕获工具构造函数
     * @constructor
     */
    function ErrorCapture() {
        //这里暂时使用bj-report进行进行错误上报，而不是使用自带的异常捕获流程
        this.initCapture();
        //初始化本地调试
        this.initLocalDebug();
    }

    /**
   * 返回一个无缓存url
   */
    ErrorCapture.prototype.getTimestampUrl = function () {
        var url = location.href;
        var joinChar = "?";
        var timers = +new Date();
        var version = '__devtool=' + timers;
        if (url.indexOf("?") > -1) {
            joinChar = "&";
        }
        if (url.indexOf("?__devtool=") > -1) {
            url = url.replace(/\?__devtool\=\d+/, '?=' + version);
        } else if (url.indexOf("&__devtool=") > -1) {
            url = url.replace(/\&__devtool\=\d+/, '&=' + version);
        } else {
            url = [url, version].join(joinChar);
        }
        return url;
    }

    /**
     * bind实现
     * @param handler 要代理的函数
     * @param context 代理函数额外参数
     */
    ErrorCapture.prototype.bind = function (handler, context) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments, 0, arguments.length).concat(context);
            return handler.apply(self, args);
        }
    }

    /**
     * 初始化异常捕获
     */
    ErrorCapture.prototype.initCapture = function () {
        this.captureCustom();
        //捕获window.error
        this.captureWindowError();
        //监听setTimeout 异常
        this.tryCatchOf(window, 'setTimeout');
        //监听setInterval异常
        this.tryCatchOf(window, 'setInterval');
    }

    /**
     * 监听全局自定义异常函数
     */
    ErrorCapture.prototype.captureCustom = function () {
        var originErrorHandler = window.onWebpackRequireErrorCapture;
        var thisContext = this;
        window.onWebpackRequireErrorCapture = function (error) {
            if (typeof originErrorHandler === 'function') {
                originErrorHandler.apply(this, error);
            }
            thisContext.onErrorOccur(error.message, error);
        }
    }

    /**
     * 初始化异常本地调试信息
     */
    ErrorCapture.prototype.initLocalDebug = function () {
        this.initShowPanel();
        this.__debug = localStorage.getItem('__debug') == 'true';
        canClick = this.__debug;
        this.initDebug();
    }

    /**
     * 添加调试模式标记
     */
    ErrorCapture.prototype.initDebug = function (force) {
        if (this.__debug || force) {
            var thisContext = this;
            var pane = document.createElement('div');
            pane.style.cssText = [
                'z-index:9999999999;padding:10px;',
                'word-wrap: break-word;position:fixed;',
                'top:0px;left:0px;right:0px;background-color:rgba(19, 18, 18, 0.83);',
                'color:#fff;white-space:pre-line;'
            ].join('');
            pane.innerHTML = '开启调试,再次连击10次关闭调试模式';
            document.body.appendChild(pane);
            pane.onclick = remove;
            function remove() {
                thisContext.debugPane = null;
                pane.onclick = null;
                if (pane.parentNode) {
                    document.body.removeChild(pane);
                }
            }
            setTimeout(remove, 2000);
            this.debugPane = pane;
        }
    }

    /**
     * InitShowErrorPanel
     */
    ErrorCapture.prototype.initShowPanel = function () {
        var context = this;
        this.addEventListener(document, 'touchstart', this.createTimesHandler(function (ev) {
            if (ev.times == 10) {
                //重置掉timers
                ev.reset();
                var debug = !context.__debug;
                if (debug) {
                    context.initDebug(true);
                    setTimeout(function () {
                        canClick = true;
                    }, 2000);
                    if (context.pane) {
                        context.pane.style.display = '';
                    }
                } else if (context.debugPane && context.debugPane.parentElement) {
                    context.debugPane.parentElement.removeChild(context.debugPane);
                    context.debugPane = null;
                    canClick = true;
                }
                context.__debug = debug;
                localStorage.setItem('__debug', debug);
            }
        }));
    }

    /**
     * 初始化消息浮层
     */
    ErrorCapture.prototype.initErrorPanel = function () {
        var pane = document.createElement('div');
        pane.style.cssText = [
            'z-index:999999;padding:10px;word-wrap: break-word;',
            'display:none;position:fixed;', '' +
            'top:0px;bottom:0px;left:0px;right:0px;',
            'background-color:rgba(19, 18, 18, 0.83);',
            'color:#fff;white-space:pre-line;',
            'overflow-y:auto;'
        ].join('')
        pane.innerHTML = '';
        this.pane = pane;
        if (document.body) {
            document.body.appendChild(pane);
        } else {
            pane.id = '______errorpanel';
            document.write(pane.outerHTML);
            this.pane = document.getElementById(pane.id);
        }
        this.addEventListener(this.pane, 'click', this.bind(function () {
            if (canClick) {
                this.pane.style.display = 'none';
                canClick = false;
            }
        }));
    }

    /**
     * 技能：捕获window.error
     */
    ErrorCapture.prototype.captureWindowError = function () {
        this.addEventListener(window, 'error', this.bind(function (ev) {
            this.onErrorOccur(ev.message, ev.error, [ev.filename, ev.lineno, ev.colno].join(':'));
        }));
    }

    /**
     * 监听指定对象上的指定函数
     */
    ErrorCapture.prototype.tryCatchOf = function (obj, name) {
        var originMethod = obj[name];
        if (typeof originMethod !== 'function') {
            return;
        }
        var tryCatchMethod = this.tryCatch(originMethod);
        //复制function的属性
        this.doAssign(tryCatchMethod, originMethod);
        obj[name] = tryCatchMethod;
    }

    /**
     * 包裹函数，监听指定函数异常，并且返回函数代理
     * @param handler 要监听的函数
     */
    ErrorCapture.prototype.tryCatch = function (handler) {
        var self = this;
        return function () {
            try {
                return handler.apply(this, arguments);
            } catch (ex) {
                self.onErrorOccur(ex.message, ex);
            }
        }
    }

    /**
     * 返回一个调用次数统计函数，在指定的间隔中连续调用会进行调用次数统计，并且传递给回调函数
     * @param delay {Number} 调用间隔
     * @param handler {Function} 回调函数
     * @returns {Function} 统计函数
     */
    ErrorCapture.prototype.createTimesHandler = function (delay, handler) {
        if (arguments.length == 1) {
            handler = delay;
            delay = null;
        }
        delay = delay || 250;
        var callTimes = 0;
        var prevCallTime = null;

        function reset() {
            callTimes = 0;
        }

        return function (ev, others) {
            if (prevCallTime == null) {
                prevCallTime = +new Date();
            }
            var currentTime = +new Date();
            if (currentTime - prevCallTime > delay) {
                callTimes = 0;
                prevCallTime = null;
            } else {
                callTimes++;
                prevCallTime = currentTime;
            }
            ev.reset = reset;
            ev.times = callTimes;
            return handler.apply(this, [ev, reset]);
        }
    }

    /**
     * 出现异常啦
     * @param message 异常消息
     * @param error 异常对象
     */
    ErrorCapture.prototype.onErrorOccur = function (message, error, filename) {
        error = error || {};
        var message = error.stack || message;
        this.showPane([filename, message].join('\n'));
    }


    /**
     * 显示异常消息
     */
    ErrorCapture.prototype.showPane = function (message) {
        if (!this.pane) {
            this.initErrorPanel();
        }
        var pane = this.pane;
        pane.style.display = this.__debug ? '' : 'none';
        pane.innerHTML = message;
    }

    /**
     * 浅复制对象
     * @param  target 目标对象
     * @param  from1 复制来源1
     * .....
     * @param fromN 复制来源N
     */
    ErrorCapture.prototype.doAssign = function (target, from1, fromN) {
        var sources = Array.prototype.slice.call(arguments, 1, arguments.length);
        var source = null;
        for (var i = 0, k = sources.length; i < k; i++) {
            source = sources[i];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }


    /**
     * 兼容方式为指定元素添加指定类型事件
     * @param element {HTMLELEMENT} dom元素
     * @param name 事件名称 例如：click dblclick
     * @param handler 事件处理函数
     */
    ErrorCapture.prototype.addEventListener = function (element, name, handler) {
        if (element.addEventListener) {
            element.addEventListener(name, handler);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, handler);
        } else {
            var origin = element['on' + name];
            element[name] = function () {
                origin && origin();
                return handler.apply(this, arguments);
            }
        }
    }

    //创建异常捕获实例
    window.ExCapture = new ErrorCapture();
}());
