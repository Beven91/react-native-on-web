var constants = require('./constants');

//临时兼容art
global.document = {
  createElement:function(){
    return null;
  }
}

require('react-native-on-web-bundler/src/register')(constants.configPath,constants.releaseDir);
