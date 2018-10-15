let path = require('path');

let configPath = path.join(__dirname, './rnw-config.js');
let releaseDir = path.resolve('release/react-web');

module.exports = {
  configPath: configPath,
  releaseDir: releaseDir,
};
