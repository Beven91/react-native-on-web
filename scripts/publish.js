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
  //依赖处理
  handleReferences();
  //处理发布
  fse
    .readdirSync(path.resolve('packages'))
    .filter(function (file) { return fse.existsSync(path.join(file, 'package.json')); })
    .map(function (dir) { return path.join(dir, 'package.json') })
    .map(handlePublishVersion);
}

/**
 * 同步传入package.json版本信息
 * @param {String} packagePath  package.json文件路径
 */
function handlePublishVersion(packagePath) {
  var package = require(packagePath);
  if(package.version === selfPackage.version){
    package.version = selfPackage.version;
    fse.writeJSONSync(packagePath, package);
    var npm = new Npm(path.dirname(packagePath));
    npm.publish();
  }
}

/**
 * 同步模板工程版本引用
 */
function handleReferences() {
  var projectPackagePath = path.resolve('packages/react-native-on-web-cli/tmpl/project/package.json');
  var projectPackage = require(projectPackagePath);
  projectPackage.dependencies['react-native-on-web'] = '^' + selfPackage.version;
  fse.writeFileSync(projectPackagePath, JSON.stringify(projectPackage, null, 2));
}

//开始处理
handlePublishVersions();