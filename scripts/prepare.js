var path = require('path');
var Npm = require('npm-shell');

var npm = new Npm(path.resolve('packages/react-native-on-web-cli/tmpl/project'));
var rnwNpm = new Npm(path.resolve('packages/react-native-on-web/'));

rnwNpm.install();
npm.run('link',['../../../react-native-on-web'])
npm.install();
