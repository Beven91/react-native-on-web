var fse = require('fs-extra');
var path  =require('path');
var Npm  =require('../cli/helpers/npm.js');
//复制cli目录
fse.copySync(path.resolve('cli/helpers'),path.resolve('cli/tmpl/project/node_modules/react-native-on-web/cli/helpers'));
fse.copySync(path.resolve('cli/packager'),path.resolve('cli/tmpl/project/node_modules/react-native-on-web/cli/packager'));


(new Npm(path.resolve('cli/tmpl/project'))).run("start");
