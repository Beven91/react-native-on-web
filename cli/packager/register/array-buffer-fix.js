/**
 * 修复core-js 2.4.1版本ArrayBuffer 为空的情况下问题
 */
var OriginalArrayBuffer = global.ArrayBuffer
var originKeys = global.Reflect ? Reflect.ownKeys(OriginalArrayBuffer) : Object.keys(OriginalArrayBuffer);

function ArrayBuffer(length) {
  return new OriginalArrayBuffer(length || 0)
}

originKeys.forEach(function (key) {
  ArrayBuffer[key] = OriginalArrayBuffer[key]
})

global.ArrayBuffer = ArrayBuffer
