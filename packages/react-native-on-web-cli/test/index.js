let path = require('path');
let Npm = require('npm-shell');
let fse = require('fs-extra');
let cwd = path.resolve('dist');
let npm = new Npm(cwd);

fse.ensureDir(cwd);
npm.node(path.join(__dirname, '../bin/react-native-on-web.js'), ['init']);
