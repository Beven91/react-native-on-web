var path = require('path');
var Npm = require('npm-shell');

var npm = new Npm(path.resolve('cli/tmpl/project'));

npm.install();
