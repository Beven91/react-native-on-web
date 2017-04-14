/**
 * 名称：React-Native ToastAndroid
 * 日期：2016-11-16
 */

//加载依赖>>
import React, { PropTypes } from 'react';
import { Text, StyleSheet, Animated } from "react-native-web";
import { render } from 'react-dom';

//短时间停留 单位：秒
const SHORT = 2000;

//较长时间停留 单位：秒
const LONG = 3500;

const AnimateValue = (v) => new Animated.Value(v);

let singleInstance = null;

export default class Toast extends React.Component {

  //短时间停留 单位：秒
  static SHORT = SHORT;

  //较长时间停留 单位：秒
  static LONG = LONG;

  /**
   * 显示一个浮层消息
   */
  static show(message, duration = SHORT, callback) {
    let document = global.document;
    if (!document) {
      return;
    } else if (singleInstance) {
      singleInstance.show(message, duration, callback);
    }
  }


  /**
   * 初始化
   */
  static init(duration = SHORT) {
    if (!singleInstance) {
      let container = document.createElement('div');
      document.body.appendChild(container);
      render(<Toast message={""} duration={duration} />, container);
    }
  }

  /**
   * 定义组件属性类型
   */
  static propTypes = {
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
    timer: PropTypes.number
  }

  /**
   * 组件构造函数
   */
  constructor(props) {
    super(props);
    this.state = this.getInitState(props.message, props.duration);
    singleInstance = this;
    this.handlers = [];
    return singleInstance;
  }

  /**
   * 渲染组件
   */
  render() {
    if (this.state.remove) {
      return null;
    }
    return (
      <Animated.Text style={{
        backgroundColor: 'rgba(0,0,0,.65)',
        color: '#ffffff',
        paddingLeft: 16,
        paddingRight: 16,
        position: 'fixed',
        zIndex: 20,
        left: '50%',
        bottom: '50%',
        fontSize: 14,
        height: 45,
        lineHeight: 45,
        borderRadius: 4,
        transform: [
          { translateX: '-50%' },
          { scale: this.state.scale }
        ]
      }}>{this.state.message}</Animated.Text>
    );
  }

  /**
   * 获取初始化组件状态值
   */
  getInitState(message, duration) {
    return {
      message,
      duration,
      showing: false,
      remove: true,
      scale: AnimateValue(1.185),
      toScale: 1
    };
  }

  /**
   * 显示浮层
   */
  show(message, duration, callback) {
    if (typeof callback == 'function') {
      this.handlers.push(callback);
    }
    setTimeout(() => {
      let state = { remove: false,message:message, showing: true, scale: AnimateValue(1.185), toScale: (1) };
      this.changeStatePlayAnimate(state);
    }, 20);
  }

  /**
  * 隐藏浮层
  */
  hide() {
    let state = { remove:false,showing: false, scale: AnimateValue(1), toScale: (0.85) };
    this.changeStatePlayAnimate(state);
  }

  /**
   * 设置状态播放动画
   */
  changeStatePlayAnimate(state) {
    this.setState(state, () => { this.playAnimate(); });
  }

  /**
   * 播放动画
   */
  playAnimate() {
    Animated.parallel([this.scaleAnimation()]).start(this.playedAnimate.bind(this));
  }

  /**
   * 动画播放完毕
   */
  playedAnimate() {
    if (this.state.showing) {
      this.waiting();
    } else {
      for (let handler of this.handlers) {
        handler();
      }
      this.handlers.length = 0;
      this.setState({ remove: true });
    }
  }

  /**
   * scale动画
   */
  scaleAnimation() {
    return Animated.timing(this.state.scale, { toValue: this.state.toScale, duration:200 });
  }

  /**
   * 计时
   */
  waiting() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.hide.bind(this), this.props.duration);
  }
}

if (typeof window != 'undefined') {
  Toast.init();
}