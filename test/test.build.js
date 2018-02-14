var fse = require('fs-extra');
var path = require('path');
var Npm = require('npm-shell');

var npm = new Npm(path.resolve('cli/tmpl/project'));

console.log('copy react-native-on-web')
//复制cli目录
fse.copySync(path.resolve('packager'), path.resolve('cli/tmpl/project/node_modules/react-native-on-web/packager'));
fse.copySync(path.resolve('src'), path.resolve('cli/tmpl/project/node_modules/react-native-on-web/src'));
fse.copySync(path.resolve('package.json'), path.resolve('cli/tmpl/project/node_modules/react-native-on-web/package.json'));

new Npm(path.resolve('cli/tmpl/project/node_modules/react-native-on-web')).install();
console.log('start web.......');
npm.run('start');
