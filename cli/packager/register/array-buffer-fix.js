/**
 * 修复core-js 2.4.1版本ArrayBuffer 为空的情况下问题
 */
var OriginalArrayBuffer = global.ArrayBuffer;

function ArrayBuffer(length) {
  return new OriginalArrayBuffer(length||0);
}

global.ArrayBuffer = ArrayBuffer;
