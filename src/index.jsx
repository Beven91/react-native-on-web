/**
 * 名称：react-native-web 扩展组件入口
 * 日期：2016-11-13
 * 描述：
 */

import React from "react";
import "./apis/AppRegistry";
import ReactNative from "react-native-web";
import Modal from "./components/Modal/Modal";
import ToastAndroid from "./components/ToastAndroid/ToastAndroid";
import TabBarIOS from "./components/TabBarIOS/TabBarIOS";
import Picker from "./components/Picker/Picker";
import StatusBar from "./components/StatusBar/StatusBar"
import AsyncStorage from "./apis/AsyncStorage"
import LayoutAnimation from "./LayoutAnimation/LayoutAnimation.js"

Object.assign(ReactNative, React,{
    Modal,
    ToastAndroid,
    TabBarIOS,
    Picker,
    StatusBar,
    AsyncStorage,
    LayoutAnimation
});

module.exports = ReactNative;

export default ReactNative;