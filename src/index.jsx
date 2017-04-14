/**
 * 名称：react-native-web 扩展组件入口
 * 日期：2016-11-13
 * 描述：
 */

import "./apis/AppRegistry";
import ReactNative from "react-native-web";
import Modal from "./components/Modal/Modal";
import ToastAndroid from "./components/ToastAndroid/ToastAndroid";
import TabBarIOS from "./components/TabBarIOS/TabBarIOS";
import Picker from "./components/Picker/Picker";
import StatusBar from "./components/StatusBar/StatusBar"

Object.assign(ReactNative, {
    Modal,
    ToastAndroid,
    TabBarIOS,
    Picker,
    StatusBar
});

module.exports = ReactNative;

export default ReactNative;