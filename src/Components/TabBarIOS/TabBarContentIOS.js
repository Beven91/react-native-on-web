/**
 * 名称：React-Native TabBarIOS Content 组件
 * 日期：2016-11-18
 * 描述：无
 */
import React from "react";
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ColorPropType } from "react-native-web";

export default class TabBarContentIOS extends React.Component {

    /**
     * 组件属性定义
     */
    static propTypes = {
        ...View.propTypes,
        selected: PropTypes.bool
    }

    /**
     * 组件构造函数
     */
    constructor(props) {
        super(props);
    }

    /**
     * 渲染组件
     */
    render() {
        let inStyle = { opacity: (this.props.selected ? 1 : 0) };
        return (
            <View  {...this.props} style={[styles.tabContent, this.props.style, inStyle]}>{this.props.children}</View>
        );
    }
}

//样式表
const styles = StyleSheet.create({
    tabContent: {
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        left:0
    }
});