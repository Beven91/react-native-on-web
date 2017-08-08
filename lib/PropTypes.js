var _react=require('react');var _react2=_interopRequireDefault(_react);
require('react-native-web');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

var PropTypes=_react2.default.PropTypes;

var ImageSourcePropType=PropTypes.oneOfType([
PropTypes.shape({
height:PropTypes.number,
uri:PropTypes.string.isRequired,
width:PropTypes.number}),

PropTypes.string]);


module.exports={
image:ImageSourcePropType};