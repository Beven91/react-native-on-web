/**
 * 名称：打包配置工具
 * 日期：2017-05-19
 * 描述: 用于设置或者读取打包命令行配置文件
 */

var path = require('path')
var fse = require('fs-extra')

// 配置文件存放位置
var configfile = path.resolve('.packager')

function Configuration () {
}

/**
 * 以会话方式安装配置，当进程结束后或者进程意外退出会自动删除已安装的配置
 * 也就是说当前配置进存在运行的进程中(包含子进程)
 *  @param config 配置对象数据 
 */
Configuration.session = function (config) {
  var thisContext = this
  var removeHandler = function (e) { thisContext.remove(e); }
  // 进程异常监听
  process.on('exit', removeHandler)
  process.on('uncaughtException', removeHandler)
  this.install(config)
  return config
}

/**
 * 安装配置文件
 * @param config 配置对象数据 
 */
Configuration.install = function (config) {
  this.check(config)
  fse.writeJSONSync(configfile, config)
}

/**
 * 移除配置文件
 */
Configuration.remove = function (e) {
  if (fse.existsSync(configfile)) {
    fse.removeSync(configfile)
  }
  if (e instanceof Error) {
    console.error(e.onlyMessage ? e.message : e)
  }
}

/**
 * 获取整个配置对象数据
 */
Configuration.get = function () {
  var file = path.resolve('.packager.js')
  var customConfig = fse.existsSync(file) ? require(file) : {}
  var config = fse.existsSync(configfile) ? fse.readJSONSync(configfile) : {
    // require('image!xx') 寻址目录列表
    imageAssets: [],
    // 静态资源打包后通过express访问的路径前缀  例如: static/
    publicPath: null,
    // 客户端代码打包入口文件
    clientContextEntry: null,
    // 服务端代码打包入口文件
    serverContextEntry: null,
    // 图片压缩配置
    minOptions: null,
    // webpack loaders
    loaders: [],
    // webpack plugins
    plugins: [],
    // webpack resovle.extensions
    extensions: [],
    // 发布忽略列表
    ignores: [],
    // 发布复制信息
    copy: []

  }
  config.customConfig = customConfig
  customConfig.ignores = customConfig.ignores || []
  customConfig.ignores = customConfig.ignores.concat(this.gitIgnore())
  if(config.install){
    customConfig.ignores.push('node_modules/**/*');
  }
  return config
}

/**
 * 读取gitignore
 */
Configuration.gitIgnore = function () {
  var file = path.resolve('.gitignore')
  var gitignore = fse.existsSync(file) ? new String(fse.readFileSync(file)) : ''
  var lines = gitignore.split('\n')
  lines = lines.map(function (line) { return line.trim().replace(/\t/g, ''); })
  return lines.filter(function(line ){  line.indexOf("node_modules")<0; })
}

/**
 * 验证打包配置参数
 */
Configuration.check = function (config) {
  var releaseDir = config.releaseDir
  this.validateException(releaseDir, '发布目录必须填写,例如: -t=d:/release 或者 --releaseDir=d:/release')
  this.validateException(this.tryMakedir(releaseDir), '无效的目标目录路径(-t / --releaseDir) ---> ' + releaseDir)
  console.log('Release target dir is:' + releaseDir)
}

/**
 * 尝试创建传入目录，如果创建失败 则返回false
 * @param {String} dir 
 */
Configuration.tryMakedir = function (dir) {
  try {
    fse.ensureDirSync(dir)
  } catch(ex) {}
  return fse.existsSync(dir)
}

/**
 * 表达式结果输出控制
 * @paaram {Boolean} r 结果 如果为true时不尽进行异常抛出，否则抛出指定消息的异常
 * @param {String} message 当r为false时 抛出的异常消息
 */
Configuration.validateException = function (r, message) {
  if (!r) {
    var error = new Error(message)
    error.onlyMessage = true
    throw error
  }
}

module.exports = Configuration
