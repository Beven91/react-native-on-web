/**
 * 开发环境，金手指
 */

(function() {

    /**
     * 金手指构造函数
     */
    function DevTool() {
        this.init();
    }

    /**
     * 初始化金手指
     */
    DevTool.prototype.init = function() {
        this.readyRefreshFeature();
    }

    /**
     * 回调绑定
     * @param handler  {Function} 要执行的回调函数，注意该函数在调用时内部的this始终为devtool的实例
     * @param paras  {any} 附带参数，可以从handler的最后一个参数取到
     * @returns {Function} 闭包函数 
     */
    DevTool.prototype.bind = function(handler, paras) {
        var context = this;
        return function() {
            return handler.apply(context, Array.prototype.slice.apply(arguments, 0, arguments.length).concat(paras));
        }
    }

    /**
     * 兼容方式为指定元素添加指定类型事件
     * @param element {HTMLELEMENT} dom元素
     * @param name 事件名称 例如：click dblclick
     * @param handler 事件处理函数
     */
    DevTool.prototype.addEventListener = function(element, name, handler) {
        if (element.addEventListener) {
            element.addEventListener(name, handler);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, handler);
        } else {
            var origin = element['on' + name];
            element[name] = function() {
                origin && origin();
                return handler.apply(this, arguments);
            }
        }
    }

    /**
     * 准备连续点击5下刷新页面功能
     */
    DevTool.prototype.readyRefreshFeature = function() {
        var context = this;
        this.addEventListener(document.body, 'click', this.createTimesHandler(function(ev) {
            console.log(ev.times);
            if (ev.times == 3) {
                window.location.href = context.noCacheUrl();
            }
        }));
    }

    /**
     * 返回一个调用次数统计函数，在指定的间隔中连续调用会进行调用次数统计，并且传递给回调函数
     * @param delay {Number} 调用间隔
     * @param handler {Function} 回调函数
     * @returns {Function} 统计函数
     */
    DevTool.prototype.createTimesHandler = function(delay, handler) {
        if (arguments.length == 1) {
            handler = delay;
            delay = null;
        }
        delay = delay || 200;
        var callTimes = 0;
        var prevCallTime = null;
        return function(ev, others) {
            if (null == prevCallTime) {
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
            ev.times = callTimes;
            return handler.apply(this, [ev, others]);
        }
    }

    /**
     * 返回一个无缓存url
     */
    DevTool.prototype.noCacheUrl = function() {
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

    //创建金手指
    window.DevTool = new DevTool();
}());