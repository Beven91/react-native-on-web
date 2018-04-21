module.exports = function (app) {

  const constants = require('../../constants')

  require('react-native-on-web-bundler/src/webpack/middleware/hot.bundle.js')(app, constants.configPath, constants.releaseDir);
}
