/**
 * 名称：同步package.json引用
 * 日期：2017-05-18
 * 描述：同步tmpl下的project package.json对应react-native-on-web的版本号
 */

let path = require('path');
let fse = require('fs-extra');
let Npm = require('npm-shell');

let selfPackage = require('../package.json');

/**
 * 同步packages目录下所有工程版本等信息
 */
function handlePublishVersions() {
  let cwd = path.resolve('packages');
  // 处理发布
  fse
    .readdirSync(cwd)
    .filter(function (file) {
      return fse.existsSync(path.join(cwd, file, 'package.json'));
    })
    .map(function (dir) {
      return path.join(cwd, dir, 'package.json');
    })
    .map(handleReferences)
    .map(handlePublishVersion);
}

/**
 * 同步传入package.json版本信息
 * @param {String} packagePath  package.json文件路径
 */
function handlePublishVersion(packagePath) {
  let pgk = require(packagePath);
  if (pgk.version !== selfPackage.version) {
    handlePrePublishVersion(packagePath);
    console.log('publish ' + pgk.name + '@' + selfPackage.version);
    pgk.version = selfPackage.version;
    fse.writeFileSync(packagePath, JSON.stringify(pgk, null, 2));
    let npm = new Npm(path.dirname(packagePath));
    npm.publish();
    handlePostPublishVersion(packagePath);
  }
}

/**
 * 同步模板工程版本引用
 */
function handleReferences(packagePath) {
  let projectPackage = require(packagePath);
  let keys = Object.keys(projectPackage.dependencies || {});
  keys.map(function (k) {
    if (k.indexOf('react-native-on-web') > -1) {
      projectPackage.dependencies[k] = '^' + selfPackage.version;
    }
  });
  keys = Object.keys(projectPackage.devDependencies || {});
  keys.map(function (k) {
    if (k.indexOf('react-native-on-web') > -1) {
      projectPackage.devDependencies[k] = '^' + selfPackage.version;
    }
  });
  fse.writeFileSync(packagePath, JSON.stringify(projectPackage, null, 2));
  return packagePath;
}

/**
 * 发布前处理
 */
function handlePrePublishVersion(project) {
  if (project.indexOf('react-native-on-web-tmpl') > -1) {
    let pgkPath = project;
    let bakPath = project + '.bak';
    let pgk = require(pgkPath);
    delete pgk.dependencies;
    delete pgk.devDependencies;
    fse.moveSync(pgkPath, bakPath, { overwrite: true });
    fse.removeSync(pgkPath);
    fse.writeFileSync(pgkPath, JSON.stringify(pgk, null, 2));
  }
}

/**
 * 发布后处理
 */
function handlePostPublishVersion(project) {
  if (project.indexOf('react-native-on-web-tmpl') > -1) {
    let pgkPath = project;
    let bakPath = project + '.bak';
    fse.moveSync(bakPath, pgkPath, { overwrite: true });
    fse.removeSync(bakPath);
  }
}

// 开始处理
handlePublishVersions();
