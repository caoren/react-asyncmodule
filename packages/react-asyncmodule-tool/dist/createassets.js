'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArray = function isArray(arr) {
    if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) !== 'object') {
        return false;
    }
    return arr instanceof Array;
};
var arrayFind = function arrayFind(arr, func) {
    if (!isArray(arr)) {
        return undefined;
    }
    var len = arr.length;
    var res = void 0;
    for (var i = 0; i < len; i += 1) {
        if (func(arr[i], i, arr)) {
            res = arr[i];
            break;
        }
    }
    return res;
};
var strEndswith = function strEndswith() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var key = arguments[1];
    var len = arguments[2];

    var slen = len;
    if (len === undefined || len > str.length) {
        slen = str.length;
    }
    return str.substring(slen - key.length, len) === key;
};
/*
 * fetch css chunks
 * compilation's chunks and Stats's chunks is diff
 * compilation is `name`
 * Stats is `names`
 */
var createAssets = function createAssets() {
    var chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var publicPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return chunks.reduce(function (hash, _ref) {
        var name = _ref.name,
            _ref$names = _ref.names,
            names = _ref$names === undefined ? [] : _ref$names,
            files = _ref.files;

        var nhash = hash;
        if (!isArray(files)) {
            return nhash;
        }
        var sname = name ? name : names[0];
        if (!sname) {
            return nhash;
        }
        var findCssFile = arrayFind(files, function (file) {
            return strEndswith(file, '.css');
        });
        if (findCssFile) {
            nhash.css[sname] = '' + publicPath + findCssFile;
        }
        var findJsFile = arrayFind(files, function (file) {
            return strEndswith(file, '.js');
        });
        if (findJsFile) {
            nhash.js[sname] = '' + publicPath + findJsFile;
        }
        return nhash;
    }, { js: {}, css: {} });
};
exports.default = createAssets;
module.exports = exports['default'];