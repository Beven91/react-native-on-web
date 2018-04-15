var path = require('path');
var Npm = require('npm-shell');
var fse = require('fs-extra');
var cwd = path.resolve('dist')
var npm = new Npm(cwd);

fse.ensureDir(cwd)
npm.node(path.join(__dirname, '../bin/react-native-on-web.js'),['init']);