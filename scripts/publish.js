/**
 * 名称：同步package.json引用
 * 日期：2017-05-18
 * 描述：同步tmpl下的project package.json对应react-native-on-web的版本号
 */

var path = require('path');
var fse = require('fs-extra');
var Npm = require('npm-shell');

var selfPackage = require('../package.json');

/** 
 * 同步packages目录下所有工程版本等信息
 */
function handlePublishVersions() {
  var cwd = path.resolve('packages');
  //处理发布
  fse
    .readdirSync(cwd)
    .filter(function (file) { return fse.existsSync(path.join(cwd, file, 'package.json')); })
    .map(function (dir) { return path.join(cwd, dir, 'package.json') })
    .map(handleReferences)
    .map(handlePublishVersion);
}

/**
 * 同步传入package.json版本信息
 * @param {String} packagePath  package.json文件路径
 */
function handlePublishVersion(packagePath) {
  var pgk = require(packagePath);
  if (pgk.version !== selfPackage.version) {
    console.log('publish ' + pgk.name + '@' + selfPackage.version);
    pgk.version = selfPackage.version;
    fse.writeFileSync(packagePath, JSON.stringify(pgk, null, 2));
    var npm = new Npm(path.dirname(packagePath));
    npm.publish();
  }
}

/**
 * 同步模板工程版本引用
 */
function handleReferences(packagePath) {
  var projectPackage = require(packagePath);
  var keys = Object.keys(projectPackage.dependencies || {});
  keys.map(function (k) {
    if (k.indexOf('react-native-on-web') > -1) {
      projectPackage.dependencies[k] = '^' + selfPackage.version;
    }
  })
  keys = Object.keys(projectPackage.devDependencies || {});
  keys.map(function (k) {
    if (k.indexOf('react-native-on-web') > -1) {
      projectPackage.devDependencies[k] = '^' + selfPackage.version;
    }
  })
  fse.writeFileSync(packagePath, JSON.stringify(projectPackage, null, 2));
  return packagePath;
}

//开始处理
handlePublishVersions();
