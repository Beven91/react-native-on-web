/**
 * 名称：React-Native TabBarItemIOS for Web
 * 日期：2016-11-17
 * 描述：无
 */
import React from "react";
import LocalPropTypes from "../../PropTypes.js";
import PropTypes from 'prop-types';
import { Image, View, Text, StyleSheet, ColorPropType, TouchableOpacity } from "react-native-web";

export default class TabBarItemIOS extends React.Component {
    static propTypes = {
        ...View.propTypes,
        /**
         * Little red bubble that sits at the top right of the icon.
         */
        badge: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        /**
         * Items comes with a few predefined system icons. Note that if you are
         * using them, the title and selectedIcon will be overridden with the
         * system ones.
         */
        systemIcon: PropTypes.oneOf([
            'bookmarks',
            'contacts',
            'downloads',
            'favorites',
            'featured',
            'history',
            'more',
            'most-recent',
            'most-viewed',
            'recents',
            'search',
            'top-rated',
        ]),
        /**
         * A custom icon for the tab. It is ignored when a system icon is defined.
         */
        icon: LocalPropTypes.image,
        /**
         * A custom icon when the tab is selected. It is ignored when a system
         * icon is defined. If left empty, the icon will be tinted in blue.
         */
        selectedIcon: LocalPropTypes.image,
        /**
         * Callback when this tab is being selected, you should change the state of your
         * component to set selected={true}.
         */
        onPress: PropTypes.func,
        /**
         * If set to true it renders the image as original,
         * it defaults to being displayed as a template
         */
        renderAsOriginal: PropTypes.bool,
        /**
         * It specifies whether the children are visible or not. If you see a
         * blank content, you probably forgot to add a selected one.
         */
        selected: PropTypes.bool,
        /**
         * Text that appears under the icon. It is ignored when a system icon
         * is defined.
         */
        title: PropTypes.string,

        unselectedTintColor: ColorPropType,

        tintColor: ColorPropType,
    };

    _onClick(e) {
        if (this.props.onPress) {
            this.props.onPress(e);
        }
        if (this.props.handleTouchTap) {
            this.props.handleTouchTap(this.props.index);
        }
    }

    render() {
        let {style, selected} = this.props;
        let textColor = selected ? { color: this.props.tintColor } : { color: this.props.unselectedTintColor };
        return (
            <View style={[styles.tab, style]}>
                {
                    this.props.badge ? <View style={styles.badge}><Text style={styles.badgeText}>{this.props.badge}</Text></View> : ''
                }
                <TouchableOpacity style={styles.link} onPress={this._onClick.bind(this)}>
                    <Image source={(this.props.selected && this.props.selectedIcon) ? this.props.selectedIcon : this.props.icon} style={styles.icon}>
                    </Image>
                    <Text style={[styles.title, textColor]}>{this.props.title}</Text>
                </TouchableOpacity >
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        position: 'relative',
        overflow: 'hidden',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:5,
    },
    link: {
        width: '100%',
        alignItems: 'center',
        outline: 'none',
    },
    badgeText: {
        color: '#fff',
        fontSize: 8,
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        top: 2,
        left: '60%',
        backgroundColor: '#FF0000',
        height: 20,
        minWidth: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:9999
    },
    icon: {
    },
    title: {
        marginTop: 4,
        fontSize: 9
    }
});
