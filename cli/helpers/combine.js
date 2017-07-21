
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

function combine(target, source) {
    return typeof source === 'function' ? (source(target) || target) : combineOptions(target, source);
}

combine.doAssign = function (target, source) {
    source = source || {}
    for (var i in source) {
        target[i] = source[i]
    }
    return target
}

module.exports = combine;
