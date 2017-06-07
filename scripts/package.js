/**
 * 名称：同步package.json引用
 * 日期：2017-05-18
 * 描述：同步tmpl下的project package.json对应react-native-on-web的版本号
 */

var path = require('path');
var fse = require('fs-extra');

var selfPackage = require('../package.json');
var packagefile = path.resolve('cli/tmpl/project/package.json');
var package = fse.readJSONSync(packagefile);
package.dependencies['react-native-on-web'] ='^'+selfPackage.version;
package.devDependencies=selfPackage.devDependencies;

//去除bin下文件的\r
var binPath  = path.resolve('bin');
fse.readdirSync(binPath).forEach(handleUnixLF);

//删除bin下文件的\r
function handleUnixLF(file){
  var content = new String(fse.readFileSync(path.join(binPath,file)));
  content = content.replace(/\r/g,'');
  fse.writeFileSync(file,content);
}

fse.writeJSONSync(packagefile,package);