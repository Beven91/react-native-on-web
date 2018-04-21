var path = require('path');
var fs = require('fs');

var file = path.resolve('assets.js');
var webpack = fs.existsSync(file) ? require(file) : {};

module.exports = function (app) {
  app.use(function (req, resp, next) {
    resp.locals = resp.locals || {};
    resp.locals.Webpack = webpack;
    next();
  })
}