/**
 * 名称：react-native-web 扩展组件入口
 * 日期：2016-11-13
 * 描述：
 */

import ReactNative from "react-native-web";
import Modal from "./components/Modal/Modal";
import ToastAndroid from "./components/ToastAndroid/ToastAndroid";
import TabBarIOS from "./components/TabBarIOS/TabBarIOS";
import Picker from "./components/Picker/Picker";

Object.assign(ReactNative, {
    Modal,
    ToastAndroid,
    TabBarIOS,
    Picker
});

module.exports = ReactNative;

export default ReactNative;