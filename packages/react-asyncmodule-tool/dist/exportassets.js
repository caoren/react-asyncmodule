'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ASSETSTYPES = ['js', 'css'];
var getAssets = function getAssets() {
    var chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var type = arguments[2];

    var obj = chunks[type];
    var method = function method(item) {
        return type === 'css' ? '<link type="text/css" href="' + item + '" rel="stylesheet">' : '<script type="text/javascript" src="' + item + '"></script>';
    };
    return names.map(function (item) {
        return obj[item];
    }).filter(function (item) {
        return !!item;
    }).map(function (item) {
        return method(item);
    }).join('');
};
// 根据names输出对应的js和css
var exportAssets = function exportAssets(chunks, names) {
    var res = {};
    ASSETSTYPES.forEach(function (item) {
        res[item] = getAssets(chunks, names, item);
    });
    return res;
};
exports.default = exportAssets;
module.exports = exports['default'];