/**
 * 名称：AsyncStorage
 * 日期：2017-04-15
 * 描述：实现react-native的AsyncStorage
 */

//引入依赖>>
import merge from 'deep-assign';
import Storage from "./Storage/Storage.js";

const mergeLocalStorageItem = (key, value) => {
  const oldValue = Storage.getItem(key);
  const oldObject = JSON.parse(oldValue);
  const newObject = JSON.parse(value);
  const nextValue = JSON.stringify(merge({}, oldObject, newObject));
  Storage.setItem(key, nextValue);
};

const handlePromise = (callback,handler)=>{
    return new Promise((resolve, reject) =>{
        try{
          let v =  handler();
          callback && callback(null,v);
          resolve(v);
        }catch(ex){
          callback && callback(ex);
          reject(ex);
        }
    });
    
}

export default class AsyncStorage {
  /**
   * 清除对应domain的所有storage数据
   * @param {Function} callback 回调函数
   */
  static clear(callback) {
    return handlePromise(callback,()=>{
      Storage.clear()
    });
  }

  /**
   * 获取当前app设置的本地数据所有的key
   * @param {Function} callback 回调函数
   */
  static getAllKeys(callback) {
    return handlePromise(callback,()=> {
        const numberOfKeys = Storage.length;
        const keys = [];
        for (let i = 0; i < numberOfKeys; i += 1) {
          const key = Storage.key(i);
          keys.push(key);
        }
        return keys;
    });
  }

  /**
   * 获取执行key对应的数据
   * @param {String} key 要获取的本地数据key名
   * @param {Function} callback 回调函数
   */
  static getItem(key,callback) {
    return handlePromise(callback,() => {
        return Storage.getItem(key);
    });
  }

  /**
   * 合并数据到已存在key的value
   * @param {String} key 要获取的本地数据key名
   * @param {Object} value 要合并的数据
   * @param {Function} callback 回调函数
   */
  static mergeItem(key, value,callback) {
    return handlePromise(callback,() => {
        mergeLocalStorageItem(key, value);
    });
  }

  /**
   * 批量获取本地存储的数据
   * @param {Array<string>} keys 要获取的keys
   * @param {Function} callback 回调函数
   *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   */
  static multiGet(keys,callback) {
    const promises = keys.map(key => AsyncStorage.getItem(key));
    return Promise.all(promises).then(
      result =>{
          let v = result.map((value, i) => [keys[i], value]);
          callback && callback(null,v);
         return Promise.resolve()
      },
      error => {
        callback && callback(error);
        return Promise.reject(error)
      }
    );
  }

  /**
   * 批量合并数据本地存储
   * @param {Array<Array<string>>} keyValuePairs 要合并的数据 格式如下:[['name','hello'],['age','33']]
   * @param {Function} callback 回调函数
   */
  static multiMerge(keyValuePairs,callback) {
    const promises = keyValuePairs.map(item => AsyncStorage.mergeItem(item[0], item[1]));
    return Promise.all(promises).then(
      result =>{
         callback && callback(null);
         return Promise.resolve()
      },
      error => {
        callback && callback(error);
        return Promise.reject(error)
      }
    );
  }

  /**
   * 批量移除数据
   * @param {Array<string>} keys 要移除的keys
   * @param {Function} callback 回调函数
   */
  static multiRemove(keys,callback) {
    const promises = keys.map(key => AsyncStorage.removeItem(key));
    return Promise.all(promises).then(
      result =>{
         callback && callback(null);
         return Promise.resolve()
      },
      error => {
        callback && callback(error);
        return Promise.reject(error)
      }
    );
  }

  /**
   * 批量设置数据
   * @param {Array<Array<string>>} keyValuePairs 要设置的数据 格式如下:[['shop','{name:'ss'}'],['age','33']]
   * @param {Function} callback 回调函数
   */
  static multiSet(keyValuePairs,callback) {
    const promises = keyValuePairs.map(item => AsyncStorage.setItem(item[0], item[1]));
    return Promise.all(promises).then(
      result =>{
         callback && callback(null);
         return Promise.resolve()
      },
      error => {
        callback && callback(error);
        return Promise.reject(error)
      }
    );
  }

  /**
   * 移除指定key的值
   * @param key 要移除的key
   * @param {Function} callback 回调函数
   */
  static removeItem(key,callback) {
    return handlePromise(callback,()=>Storage.removeItem(key));
  }

  /**
   * 设置指定key的值
   * @param key 要设置的key
   * @param value 要设置key的value
   * @param {Function} callback 回调函数
   */
  static setItem(key, value,callback) {
    return handlePromise(callback,()=>Storage.setItem(key, value));
  }
}