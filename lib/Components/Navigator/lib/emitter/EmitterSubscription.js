'use strict';Object.defineProperty(exports,"__esModule",{value:true});

var _EventSubscription2=require("./EventSubscription");var _EventSubscription3=_interopRequireDefault(_EventSubscription2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var




EmitterSubscription=function(_EventSubscription){_inherits(EmitterSubscription,_EventSubscription);









function EmitterSubscription(subscriber,listener,context){_classCallCheck(this,EmitterSubscription);var _this=_possibleConstructorReturn(this,(EmitterSubscription.__proto__||Object.getPrototypeOf(EmitterSubscription)).call(this,
subscriber));
_this.listener=listener;
_this.context=context;return _this;
}return EmitterSubscription;}(_EventSubscription3.default);exports.default=


EmitterSubscription;