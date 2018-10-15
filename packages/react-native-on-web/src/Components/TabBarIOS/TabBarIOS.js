/**
 * 名称：React-Native TabBarIOS for Web
 * 日期：2016-11-17
 * 描述：无
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ColorPropType } from 'react-native-web';
import TabBarItemIOS from './TabBarItemIOS';
import TabBarContentIOS from './TabBarContentIOS';

export default class TabBarIOS extends React.Component {
  static Item = TabBarItemIOS;

  static propTypes = {
    ...View.propTypes,
    /**
     * Color of text on unselected tabs
     */
    unselectedTintColor: ColorPropType,
    /**
     * Color of the currently selected tab icon
     */
    tintColor: ColorPropType,
    /**
     * Background color of the tab bar
     */
    barTintColor: ColorPropType,
    /**
     * A Boolean value that indicates whether the tab bar is translucent
     */
    translucent: PropTypes.bool,
    /**
     * Specifies tab bar item positioning. Available values are:
     * - fill - distributes items across the entire width of the tab bar
     * - center - centers item in the available tab bar space
     * - auto (default) - distributes items dynamically according to the
     * user interface idiom. In a horizontally compact environment (e.g. iPhone 5)
     * this value defaults to `fill`, in a horizontally regular one (e.g. iPad)
     * it defaults to center.
     */
    itemPositioning: PropTypes.oneOf(['fill', 'center', 'auto']),
  };

  /**
   * 组件构造函数
   */
  constructor(props) {
    super(props);
  }

  /**
   * 获取初始化状态数据
   */
  state = {
    selectedIndex: 0,
  }

  /**
   * 点击子tab时触发
   */
  handleTouchTap(index) {
    if (this.state.selectedIndex != index) {
      this.setState({ selectedIndex: index });
    }
  }

  /**
   * 获取组件属性控制样式
   */
  getPropsStyle() {
    return {
      backgroundColor: this.props.barTintColor,
      opacity: this.props.translucent ? 0.5 : 1,
    };
  }

  /**
   * 渲染所有tabbar对应的tab-content
   */
  _renderContents() {
    let tabContents = [];
    let selectedIndex = this.state.selectedIndex;
    let tabs = React.Children.map(this.props.children, (tab, index) => {
      let selected = index == selectedIndex;
      let children = tab.props.children;
      if (tab.type.name != 'TabBarItemIOS') {
        let type = tab.type.displayName || tab.type.name || tab.type;
        throw 'Tabbar only accepts TabBar.Item Components as children. Found ' + type + ' as child number ' + (index + 1) + ' of Tabbar';
      } else if (children && selected) {
        tabContents.push(<TabBarContentIOS key={index} selected={selected} >{children}</TabBarContentIOS>);
      } else {
        tabContents.push(undefined);
      }
      return React.cloneElement(tab, {
        index: index,
        selected: selected,
        unselectedTintColor: this.props.unselectedTintColor,
        tintColor: this.props.tintColor,
        handleTouchTap: this.handleTouchTap.bind(this),
      });
    });
    return { tabContents, tabs };
  }

  /**
   * 渲染组件
   */
  render() {
    let { tabContents, tabs } = this._renderContents();
    return (
      <View style={[styles.tabGroup, this.props.style]}>
        <View style={styles.tabContents}>
          {tabContents}
        </View>
        <View style={[styles.bar, this.getPropsStyle()]}>
          {tabs}
        </View>
      </View>
    );
  }
}

// 样式表
const styles = StyleSheet.create({
  tabGroup: {
    flex: 1,
    flexDirection: 'column',
  },
  bar: {
    height: 50,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
  },
  tabContents: {
    flex: 1,
    flexDirection: 'row',
  },
});
