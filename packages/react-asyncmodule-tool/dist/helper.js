'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// entry unique
var ENTRYKEY = exports.ENTRYKEY = '@ENTRY';

// 判断当前字符串(str)是否是以另外一个给定的子字符(key)串结尾
var strEndswith = exports.strEndswith = function strEndswith() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var slen = str.length;
    return str.substring(slen - key.length, slen) === key;
};

var filterAssets = exports.filterAssets = function filterAssets(assets) {
    return function (item) {
        return strEndswith(item, assets);
    };
};

// 是否以`.js` 结尾
var filterJs = exports.filterJs = filterAssets('.js');

// 是否以 `.css` 结尾
var filterCss = exports.filterCss = filterAssets('.css');

// 生成完整的 script 格式
var mapScript = exports.mapScript = function mapScript(item) {
    var isAsync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var asyncAttribute = typeof isAsync === 'boolean' && isAsync ? ' async ' : ' ';
    return '<script type="text/javascript"' + asyncAttribute + 'src="' + item + '"></script>';
};

// 生成完成的 style
var mapStyle = exports.mapStyle = function mapStyle(item, url) {
    return '<style data-href="' + url + '" type="text/css">' + item + '</style>';
};

// 生成完整的 link 格式
var mapLink = exports.mapLink = function mapLink(item) {
    return '<link href="' + item + '" rel="stylesheet">';
};

// 去除数组的重复数据，未考虑数字和字符串的差别，故只适用于该场景
var uniq = exports.uniq = function uniq(arr) {
    var obj = {};
    var narr = [];
    arr.forEach(function (item) {
        if (!obj[item]) {
            narr.push(item);
            obj[item] = 1;
        }
    });
    return narr;
};

// 合并2个路径
var joinPath = exports.joinPath = function joinPath(path, filename) {
    var gap = path.slice(-1) === '/' ? '' : '/';
    return '' + path + gap + filename;
};