var path = require('path');

var configPath = path.join(__dirname, './rnw-config.js');
var releaseDir = path.resolve('release/react-web');

module.exports = {
  configPath: configPath,
  releaseDir: releaseDir
}