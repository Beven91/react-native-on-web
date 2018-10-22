let path = require('path');
let fs = require('fs');

let file = path.resolve('assets.json');
let webpack = fs.existsSync(file) ? require(file) : {};

require.extensions['.css'] = () => '';

module.exports = function (app) {
  app.use(function (req, resp, next) {
    resp.locals = resp.locals || {};
    resp.locals.Webpack = webpack;
    next();
  });
}
  ;
