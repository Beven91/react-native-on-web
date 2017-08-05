var fse = require('fs-extra');
var path = require('path');

fse.removeSync(path.join(__dirname, '..', 'lib'));