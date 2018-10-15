/**
 * 名称：React-Native Modal for Web
 * 日期：2016-11-16
 * 描述：无
 */
import { Easing, StyleSheet, Animated, Dimensions } from 'react-native-web';
import React from 'react';
import PropTypes from 'prop-types';

const animateValue = (v) => new Animated.Value(v);

/**
 * The Modal component is a simple way to present content above an enclosing view.
 *
 * _Note: If you need more control over how to present modals over the rest of your app,
 * then consider using a top-level Navigator._
 *
 * ```javascript
 * import React, { Component } from 'react';
 * import { Modal, Text, TouchableHighlight, View } from 'react-native';
 *
 * class ModalExample extends Component {
 *
 *   state = {
 *     modalVisible: false,
 *   }
 *
 *   setModalVisible(visible) {
 *     this.setState({modalVisible: visible});
 *   }
 *
 *   render() {
 *     return (
 *       <View style={{marginTop: 22}}>
 *         <Modal
 *           animationType={'slide'}
 *           transparent={false}
 *           visible={this.state.modalVisible}
 *           onRequestClose={() => {alert('Modal has been closed.')}}
 *           >
 *          <View style={{marginTop: 22}}>
 *           <View>
 *             <Text>Hello World!</Text>
 *
 *             <TouchableHighlight onPress={() => {
 *               this.setModalVisible(!this.state.modalVisible)
 *             }}>
 *               <Text>Hide Modal</Text>
 *             </TouchableHighlight>
 *
 *           </View>
 *          </View>
 *         </Modal>
 *
 *         <TouchableHighlight onPress={() => {
 *           this.setModalVisible(true)
 *         }}>
 *           <Text>Show Modal</Text>
 *         </TouchableHighlight>
 *
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
export default class Modal extends React.Component {
  static isReactNativeComponent = true

  /**
   * 定义属性类型
   */
  static propTypes = {
    /**
     * 窗口动画类型
     *
     * - `slide` 从右侧滑动进入
     * - `fade` 淡入
     * - `none` 无动画
     */
    animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
    /**
     * 是否背景透明
     */
    transparent: PropTypes.bool,
    /**
     * 窗口是否可见
     */
    visible: PropTypes.bool,
    /**
     * 在窗口关闭后触发
     */
    onRequestClose: PropTypes.func,
    /**
     * 在窗口进入后触发
     */
    onShow: PropTypes.func,
    animated: PropTypes.bool,
    /**
     * The `supportedOrientations` prop allows the modal to be rotated to any of the specified orientations.
     * On iOS, the modal is still restricted by what's specified in your app's Info.plist's UISupportedInterfaceOrientations field.
     * @platform ios
     */
    supportedOrientations: PropTypes.arrayOf(PropTypes.oneOf(['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'])),
    /**
     * The `onOrientationChange` callback is called when the orientation changes while the modal is being displayed.
     * The orientation provided is only 'portrait' or 'landscape'. This callback is also called on initial render, regardless of the current orientation.
     * @platform ios
     */
    onOrientationChange: PropTypes.func,
  };


  /**
   * 组件默认属性
   */
  static defaultProps = {
    visible: true,
  };

  /**
   * 组件构造函数
   */
  constructor(props) {
    super(props);
    // 初始化动画参数
    this.initAnimation();
    // 初始化状态
    this.state = this.initState();
  }

  /**
   * 初始化动画参数
   */
  initAnimation() {
    this.screenWidth = Dimensions.get('window').width;
    this.translateX = animateValue(0);
    this.opacity = animateValue(0);
    // 注册的动画
    this.createAnimations = {
      slide: this.slideAnimation.bind(this),
      fade: this.fadeAnimation.bind(this),
    };
  }

  /**
   * 获取初始化状态值
   */
  initState() {
    let state = {
      initStyle: this.getInitialStyle(state),
      shouldUpdate: false,
    };
    return state;
  }

  /**
   * 初始化模态窗口初始化动画样式
   */
  getInitialStyle(state) {
    let { transparent } = this.props;
    let modalStyle = { backgroundColor: transparent ? 'transparent' : 'white', backfaceVisibility: 'hidden', perspective: 1000 };
    switch (this.getAnimationType()) {
      case 'slide':
        {
          let interpolate = this.translateX.interpolate({
            inputRange: [0, 1],
            outputRange: [this.screenWidth, 0],
          });
          modalStyle.transform = [{ translate3d: '0,0,0' }, { translateX: interpolate }];
        }
        break;
      case 'fade':
        {
          let interpolate2 = this.opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });
          modalStyle.opacity = interpolate2;
        }
        break;
      default:
        break;
    }
    return modalStyle;
  }

  /**
   * 当属性改变时,切换窗口样式
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      let playAnimation = () => this.playAnimation();
      if (nextProps.visible) {
        this.setState({ shouldUpdate: true }, playAnimation);
      } else {
        setTimeout(playAnimation, 20);
      }
    }
  }

  /**
   * 组件初始化完毕
   */
  componentDidMount() {
    if (this.props.visible) {
      // 如果初始化是显示则播放进入动画
      this.playAnimation();
    }
  }

  /**
   * 是否允许组件更新
   */
  shouldComponentUpdate(a, state) {
    return state.shouldUpdate;
  }

  /**
   * 组件更新完毕
   */
  componentDidUpdate() {
    this.state.shouldUpdate = false;
  }

  /**
   * 渲染组件
   */
  render() {
    if (!this.props.visible) {
      return null;
    }
    return (
      <Animated.View style={[styles.modal, this.state.initStyle]} onStartShouldSetResponder={this._shouldSetResponder.bind(this)}>
        {this.props.children}
      </Animated.View>
    );
  }

  /**
   * 播放动画
   */
  playAnimation() {
    let createAnimation = this.createAnimations[this.getAnimationType()];
    if (createAnimation) {
      createAnimation().start(this.onPlayedAnimate.bind(this));
    } else {
      this.triggerVisibleHandler();
    }
  }

  /**
   * 开始播放窗口动画
   */
  onPlayedAnimate() {
    this.triggerVisibleHandler();
  }

  /**
   * 获取窗口进入动画类型
   */
  getAnimationType() {
    return this.props.animationType || 'slide';
  }

  /**
   * 自动执行窗口事件
   */
  triggerVisibleHandler() {
    if (this.props.visible === false) {
      // 更新ui 隐藏modal
      this.setState({ shouldUpdate: true });
      setTimeout(() => this.emit(this.props.onRequestClose), 20);
    } else {
      this.emit(this.props.onShow);
    }
  }

  /**
   * slide动画
   */
  slideAnimation() {
    let toValue = this.props.visible ? 1 : 0;
    // circle,cubic,ease,in,inOut,out,linear
    return Animated.timing(this.translateX, { toValue: toValue, duration: 260, easing: Easing.inOut(Easing.ease) });
  }

  /**
   * 淡入动画
   */
  fadeAnimation() {
    let toValue = this.props.visible ? 1 : 0;
    return Animated.timing(this.opacity, { toValue: toValue, duration: 300 });
  }

  // We don't want any responder events bubbling out of the modal.
  _shouldSetResponder() {
    return true;
  }

  /**
   * 执行传入函数参数，如果参数为null，则不进行调用，避免null异常
   * @param handler
   * @param ...args 参数
   */
  emit(handler, ...args) {
    if (typeof handler === 'function') {
      return handler(...args);
    }
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#fff',
    zIndex: 10,
  },
});
