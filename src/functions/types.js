const isArray = (arr) => (Array.isArray(arr));
const isObject = (obj) => (Object.prototype.toString.call(obj) === '[object Object]');
const isBasedOnObject = (obj) => (obj !== null && typeof (obj) === 'object');
const isFunction = (func) => (typeof (func) === 'function');
const isString = (string) => (typeof (string) === 'string');
const isDate = (date) => (Object.prototype.toString.call(date) === '[object Date]');
// eslint-disable-next-line no-restricted-globals
const isNumber = (num) => (typeof (num) === 'number' && !isNaN(num));
// eslint-disable-next-line no-restricted-globals
const isCleanNumber = (num) => (typeof (num) === 'number' && num !== Infinity && !(isNaN(num)));
// eslint-disable-next-line no-restricted-globals
const isInteger = (int) => (typeof (int) === 'number' && int !== Infinity && !(isNaN(int)) && int % 1 === 0);
// eslint-disable-next-line no-prototype-builtins
const isPromise = (prom) => Promise.prototype.isPrototypeOf(prom);

/**
 * @type {{date: string, number: string, string: string, null: string, array: string, function: string, object: string,
 *     undefined: string}}
 */
const typeStrings = {
    array: '[object Array]',
    object: '[object Object]',
    function: '[object Function]',
    string: '[object String]',
    number: '[object Number]',
    date: '[object Date]',
    undefined: '[object Undefined]',
    null: '[object Null]'
};

/**
 * Array.firstOrDefault
 * @param {*[]} arr
 * @return {null|*}
 */
const safeFirst = (arr) => {
    if (!isArray(arr)) return null;
    return (arr || [])[0] || null;
};

/**
 * get Type string. More different types than typeof
 * @param {*} val
 * @return {string}
 */
const getType = (val) => ({}.toString.call(val))
.replace('[object ', '')
.replace(']', '')
.toLowerCase();

/**
 * length of array or string, count of number digits or count of object keys
 * @param {*[]|Object|string|number} val
 * @return {number}
 */
const length = (val) => {
    if (!isArray(val) && !isString(val) && !isObject(val) && !isNumber(val)) return 0;
    const type = getType(val);
    switch (type) {
        case 'object':
            return (Object.keys(val) || []).length;
        case 'string':
            return (val || '').length;
        case 'array':
            return (val || []).length;
        case 'number':
            return (`${val}` || '').length;
        default:
            return 0;
    }
};

/**
 * @param {*} value
 * @return {boolean}
 */
export const isNullOrEmpty = (value) => {
    const type = getType(value);
    switch (type) {
        case 'undefined':
        case 'null':
            return true;
        case 'string':
            return /^ *$/i.test(value);
        case 'object':
            return length(Object.keys(value)) === 0;
        case 'array':
            return length(value) === 0;
        case 'number':
        case 'boolean':
        case 'function':
            return false;
        default:
            return false;
    }
};

/**
 * @param {*} value
 * @param {*} replacement
 * @return {*}
 */
export const replaceEmpty = (value, replacement) => (isNullOrEmpty(value) ? replacement : value);

/**
 * Get key from object if it exists, return null otherwise
 * @param {Object} object
 * @param {string} key
 * @return {null|*}
 */
export const safeValue = (object, key) => {
    if (!isObject || !Object.hasOwnProperty.call(object, key)) return null;
    return object[key];
};

/**
 * @param {Object} obj
 * @param {string }key
 * @return {boolean}
 */
export const hasKey = (obj, key) => Object.hasOwnProperty.call(obj, key);

/**
 * @callback forEachKeyCallback
 * @param {string} key
 * @param {*} [value]
 * @param {number} index
 * @param {Object} sourceObject
 */
/**
 *
 * @param {Object} obj
 * @param {ForEachCallback} callback
 */
export const forEachKey = (obj, callback) => {
    if (!isObject(obj) || !isFunction(callback)) return;
    const keys = Object.keys(obj);
    for (let i = 0; i < length(keys); i += 1) {
        callback(keys[i], obj[keys[i]], i, obj);
    }
};

/**
 * Map object to another object
 * @param {Object} obj
 * @param {forEachKeyCallback} callback
 * @return {Object}
 */
export const mapObject = (obj, callback) => {
    if (!isObject(obj) || !isFunction(callback)) return {};
    const keys = Object.keys(obj);
    const newObj = { ...obj };
    for (let i = 0; i < length(keys); i += 1) {
        newObj[keys[i]] = callback(keys[i], obj[keys[i]], i, obj);
    }
    return newObj;
};

/**
 * Map object to an array
 * @param {Object} obj
 * @param {forEachKeyCallback} callback
 * @return {[]|*[]}
 */
export const mapObjectToArray = (obj, callback) => {
    if (!isObject(obj) || !isFunction(callback)) return [];
    const keys = Object.keys(obj);
    const arr = [];
    for (let i = 0; i < length(keys); i += 1) {
        arr[i] = callback(keys[i], obj[keys[i]], i, obj);
    }
    return arr;
};

/**
 * @callback reduceCallback
 * @param {Object} resultObject
 * @param {string} key
 * @param {*} [value]
 * @param {number} index
 * @param {Object} sourceObject
 */
/**
 * like Array.reduce but for objects
 * @param {Object} obj
 * @param {reduceCallback} callback
 * @param {Object} [initialValue={}]
 * @return {{}}
 */
export const reduceObject = (obj, callback, initialValue = {}) => {
    if (!isObject(obj) || !isFunction(callback)) return {};
    const keys = Object.keys(obj);
    let newObj = initialValue;
    for (let i = 0; i < length(keys); i += 1) {
        newObj = callback(newObj, keys[i], obj[keys[i]], i, obj);
    }
    return newObj;
};

/**
 * Replace up to maxReplacements occurrences of a string
 * @param {string} string
 * @param {string|RegExp} search
 * @param {string} replacement
 * @param {number} maxReplacements
 * @return {string}
 */
export const replaceAll = (string, search, replacement, maxReplacements = 50) => {
    let i = 0;
    let newString = string;
    while (i < maxReplacements) {
        const tempString = newString.replace(search, replacement);
        if (tempString === newString) {
            return tempString;
        }
        newString = tempString;
        i++;
    }
    return newString;
};

const objectPrototype = {
    reduce: function (callback, initialValue) {
        return reduceObject(this, callback, initialValue);
    },
    map: function (callback) {
        return mapObject(this, callback);
    },
    mapToArray: function (callback) {
        return mapObjectToArray(this, callback);
    },
    forEach: function (callback) {
        return forEachKey(this, callback);
    },
    safeValue: function (key) {
        return safeValue(this, key)
    },
    ...Object.prototype,
    __proto__: undefined
};

/**
 * Extend this object's prototype with this helper's functions
 * @param {Object} [object={}]
 * @param {boolean} [mutate=true] - whether this function should mutate the passed object or just return a copy
 * @return {Object|{}}
 */
export function extend(object = {}, mutate = true) {
    if (!isObject(object)) return object;
    if (mutate) {
        object.__proto__ = objectPrototype;
        return object;
    } else {
        return {
            ...object,
            __proto__: objectPrototype
        }
    }
}

const regex = {
    number: /^[\d]*$/,
    integer: /^[0-9]*$/,
    httpsUrl: /(?:(?:(?:https):)\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/i,
    whitespace: /^ +$/
};

const types = {
    isArray,
    isObject,
    isBasedOnObject,
    isFunction,
    isString,
    isDate,
    isNumber,
    isCleanNumber,
    isInteger,
    isPromise,
    types: typeStrings,
    safeFirst,
    getType,
    length,
    isNullOrEmpty,
    replaceEmpty,
    safeValue,
    hasKey,
    forEachKey,
    mapObject,
    mapObjectToArray,
    reduceObject,
    replaceAll,
    regex,
    extend
};

export default types;
