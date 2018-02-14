/**
 * 名称：React-Native Picker for Web
 * 日期：2016-11-18
 * 描述：无
 */
import { View, I18nManager, Platform, StyleSheet, Animated, Dimensions } from "react-native-web";
import createDOMElement from "react-native-web/dist/modules/createDOMElement";
import React from 'react';
import PropTypes from 'prop-types';

const PICKER = 'picker';

export default class Picker extends React.Component {
  static propTypes = {
    onValueChange: PropTypes.func,
    selectedValue: PropTypes.any, // string or integer basically
  }

  /**
   * 默认组件属性值
   */
  static defaultProps = {
    selectedValue: ""
  }

  /**
   * 组件构造函数
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue != this.props.selectedValue) {
      this.setState({ selectedValue: nextProps.selectedValue });
    }
  }

  componentDidUpdate() {
    this._syncDefaultValue();
  }

  componentDidMount() {
    this._syncDefaultValue();
  }

  /**
   * 有时候在异步加载时，如果当前属性中没有选中值时同步select默认选中下标0的值
   */
  _syncDefaultValue() {
    let selectedValue = this.state.selectedValue;
    //防止selected 默认选中0 异步设置selectedValue 时不同步问题 为了防止刷新，这里不进行setState
    if ((selectedValue || '').toString().replace(/\s/g, '') == '') {
      this.state.selectedValue = this.refs.picker.value;
    }
  }

  _onChange(event) {
    // shim the native event
    event.nativeEvent.newValue = this.refs[PICKER].value;

    this.setState({ selectedValue: event.nativeEvent.newValue });

    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(event.nativeEvent.newValue);
    }
  }

  render() {
    let {style, children} = this.props;
    let {selectedValue} = this.state;
    return createDOMElement('select', {
      children: children,
      ref: PICKER,
      value: selectedValue,
      onChange: this._onChange.bind(this),
      style: [styles.picker, style]
    });
  }
}

Picker.Item = React.createClass({
  propTypes: {
    value: PropTypes.any, // string or integer basically
    label: PropTypes.string,
  },

  render: function () {
    return <option value={this.props.value}>{this.props.label}</option>;
  },
});

//样式表
const styles = {
  picker: {
    margin: 10,
    color: 'inherit',
    font: 'inherit',
  }
}