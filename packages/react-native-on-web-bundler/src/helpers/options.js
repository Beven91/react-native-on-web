
let path = require('path');

/**
 * 属性合并工具
 */
function Options() {

}

/**
 * 将来源属性对象(source)深合并到目标属性对象(target)中
 * @param {Object} target 目标属性对象
 * @param {Object} source 来源属性对象
 * @returns {Object} 合并后的target
 */
Options.prototype.merge = function (target, source) {
  let isFunction = typeof source == 'function';
  return isFunction ? (source(target) || target) : this._merge(target, source);
};

/**
 *  将来源属性对象(source)浅合并(一级属性值覆盖)到目标属性对象(target)中
 */
Options.prototype.assign = function (target, source) {
  return Object.assign(target, source);
};

/**
 * 深合并source属性到target对象中
 * 值类型属性直接使用source.value覆盖target.value
 * 数组类型使用target.value.concat(source.value)
 * 对象类型：再使用merge进行合并
 * @param {Object} target 目标属性对象
 * @param {Object} source 来源属性对象
 * @returns {Object} 合并后的target
 */
Options.prototype._merge = function (target, source) {
  if (source) {
    let merge = this._merge.bind(this);
    Object.keys(source).forEach(function (key) {
      let targetValue = target[key];
      let sourceValue = source[key];
      let objType = Object.prototype.toString.call(targetValue);
      switch (objType) {
        case '[object Array]':
          target[key] = targetValue.concat(sourceValue || []);
          break;
        case '[object Object]':
          target[key] = merge(targetValue, sourceValue);
          break;
        default:
          target[key] = sourceValue;
          break;
      }
    });
  }
  return target;
};

Options.prototype.unAssign = function (v, dv) {
  if (v === null || v === undefined || v === '') {
    return dv;
  } else {
    return v;
  }
};

Options.prototype.relativeAlias = function (alias, projectRoot) {
  let keys = Object.keys(alias || {});
  keys.forEach(function (k) {
    let name = alias[k];
    if (path.isAbsolute(name)) {
      alias[k] = './' + path.relative(projectRoot, name).replace(/\\/g, '/');
    }
  });
  return alias;
};

module.exports = new Options();
