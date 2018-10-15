/**
 * 名称：内存localStorage
 * 日期：2017-04-17
 * 描述：用于支持AsyncStorage 非浏览器端localStorage兼容 目前不打算实现同构数据一致，仅保持无错误
 */

let cache = {};

class MemoeryStorage {
  constructor(isSessionStorage) { }

  get length() {
    return Object.keys(cache).length;
  }

  key(index) {
    return Object.keys(cache)[index];
  }

  getItem(key) {
    return cache[key];
  }

  setItem(key, data) {
    cache[key] = data;
  }

  removeItem(key) {
    if (key in cache) {
      delete cache[key];
    }
  }

  clear() {
    cache = {};
  }
}

module.exports = global.localStorage ? global.localStorage : new MemoeryStorage();
