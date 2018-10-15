import PropTypes from 'prop-types';
import 'react-native-web';

const ImageSourcePropType = PropTypes.oneOfType([
  PropTypes.shape({
    height: PropTypes.number,
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
  }),
  PropTypes.string,
]);

module.exports = {
  image: ImageSourcePropType,
};
