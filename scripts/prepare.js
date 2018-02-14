var path = require('path');
var Npm = require('npm-shell');

var npm = new Npm(path.resolve('packages/react-native-on-web-cli/tmpl/project'));

npm.install();