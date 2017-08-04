module.exports = function (app) {

    const constants = require('../../constants')

    require('rnw-bundler/src/webpack/middleware/hot.bundle.js')(app,constants.configPath,constants.releaseDir);
}
