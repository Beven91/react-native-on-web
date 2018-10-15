/**
 * 名称：React-Native ToastAndroid
 * 日期：2016-11-16
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, Animated } from 'react-native-web';
import { render } from 'react-dom';

// 短时间停留 单位：秒
const SHORT = 2000;

// 较长时间停留 单位：秒
const LONG = 3500;

const animateValue = (v) => new Animated.Value(v);

let singleInstance = null;

export default class Toast extends React.Component {
  // 短时间停留 单位：秒
  static SHORT = SHORT;

  // 较长时间停留 单位：秒
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

  static showWithGravity(...params) {
    return this.show(...params);
  }


  /**
   * 初始化
   */
  static init(duration = SHORT) {
    if (!singleInstance) {
      let container = document.createElement('div');
      document.body.appendChild(container);
      render(<Toast message={''} duration={duration} />, container);
    }
  }

  /**
   * 定义组件属性类型
   */
  static propTypes = {
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
    timer: PropTypes.number,
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
      <Animated.View style={
        [
          styles.toast,
          {
            transform: [
              { scale: this.state.scale },
            ],
          },
        ]}>
        <Text style={styles.toastInner}>{this.state.message}</Text>
      </Animated.View>
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
      scale: animateValue(1.185),
      toScale: 1,
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
      let state = { duration: duration, remove: false, message: message, showing: true, scale: animateValue(1.185), toScale: (1) };
      this.changeStatePlayAnimate(state);
    }, 20);
  }

  /**
  * 隐藏浮层
  */
  hide() {
    let state = { remove: false, showing: false, scale: animateValue(1), toScale: (0.85) };
    this.changeStatePlayAnimate(state);
  }

  /**
   * 设置状态播放动画
   */
  changeStatePlayAnimate(state) {
    this.setState(state, () => {
      this.playAnimate();
    });
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
    return Animated.timing(this.state.scale, { toValue: this.state.toScale, duration: 200 });
  }

  /**
   * 计时
   */
  waiting() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.hide.bind(this), this.state.duration);
  }
}

if (typeof window != 'undefined') {
  Toast.init();
}

const styles = StyleSheet.create({
  toast: {
    position: 'fixed',
    zIndex: 100,
    width: '100%',
    left: 0,
    bottom: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastInner: {
    fontSize: 14,
    lineHeight: 22,
    color: '#ffffff',
    borderRadius: 4,
    display: 'inline-block',
    backgroundColor: 'rgba(0,0,0,.65)',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
    marginLeft: 25,
    marginRight: 25,
  },
});
