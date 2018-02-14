var constants = require('./constants');

//临时兼容art
global.document = {
  createElement:function(){
    return null;
  }
}

require('rnw-bundler/src/register')(constants.configPath,constants.releaseDir);
