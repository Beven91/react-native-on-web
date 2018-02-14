var path = require('path');
var Npm = require('npm-shell');

var cwd = path.resolve('packages/react-native-on-web-cli/tmpl/project');
var npm = new Npm(cwd);

console.log('Start web.......');
npm.run('start', [], null, {
  'NODE_PATH': path.join(cwd, 'node_modules')
});
