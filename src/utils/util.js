/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * Object 深度冻结
 * @param {Object} obj 冻结对象
 */
export function deepFreeze(obj) {
    // 取回定义在obj上的属性名
    var propNames = Object.getOwnPropertyNames(obj);

    // 在冻结自身之前冻结属性
    propNames.forEach(name => {
        var prop = obj[name]

        // 如果prop是个对象，冻结它
        if (isObject(prop)) {
            deepFreeze(prop)
        }
    });

    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj)
}

/**
 * format formdata
 */
export function toFormData(items) {
    let result = new FormData()
    if (isObject(items)) {
        Object.keys(items).map(key => {
            if (!Array.isArray(items[key])) {
                result.append(key, items[key])
            } else if (Array.isArray(items[key])) {
                items[key].forEach(item => {
                    result.append(key, item)
                })
            }
        })
    }
    return result
}

