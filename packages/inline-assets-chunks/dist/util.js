'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * 获取css chunks
 * compilation的chunks和Stats中的chunks有差别
 * compilation里是name
 * Stats里是names
 */
var createAssetsHash = exports.createAssetsHash = function createAssetsHash() {
    var chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var publicPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return chunks.reduce(function (hash, _ref) {
        var name = _ref.name,
            _ref$names = _ref.names,
            names = _ref$names === undefined ? [] : _ref$names,
            files = _ref.files;

        var nhash = hash;
        if (!Array.isArray(files)) {
            return nhash;
        }
        var sname = name ? name : names[0];
        if (!sname) {
            return nhash;
        }
        var findCssFile = files.find(function (file) {
            return file.endsWith('.css');
        });
        if (findCssFile) {
            nhash.css[sname] = '' + publicPath + findCssFile;
        }
        var findJsFile = files.find(function (file) {
            return file.endsWith('.js');
        });
        if (findJsFile) {
            nhash.js[sname] = '' + publicPath + findJsFile;
        }
        return nhash;
    }, { js: {}, css: {} });
};
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
var exportAssets = exports.exportAssets = function exportAssets(chunks, names) {
    var res = {};
    ASSETSTYPES.forEach(function (item) {
        res[item] = getAssets(chunks, names, item);
    });
    return res;
};