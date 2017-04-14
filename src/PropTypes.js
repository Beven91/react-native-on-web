import React from "react";
import "react-native-web";

const PropTypes = React.PropTypes;

const ImageSourcePropType = PropTypes.oneOfType([
    PropTypes.shape({
        height: PropTypes.number,
        uri: PropTypes.string.isRequired,
        width: PropTypes.number
    }),
    PropTypes.string
]);

module.exports = {
    image: ImageSourcePropType,
}