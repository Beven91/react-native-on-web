module.exports = function (target, source) {
    return typeof source === 'function' ? (source(target) || target) : combineOptions(target, source);
}

function combineOptions(target, source) {
    source = source || {};
    Object.keys(source).forEach(function (key) {
        var targetValue = target[key];
        var sourceValue = source[key];
        if (targetValue instanceof Array) {
            targetValue = targetValue.concat(sourceValue || []);
        } else if (targetValue && typeof targetValue === 'object') {
            targetValue = combineOptions(targetValue, sourceValue);
        } else {
            targetValue = sourceValue;
        }
        target[key] = targetValue;
    })
    return target;
}
