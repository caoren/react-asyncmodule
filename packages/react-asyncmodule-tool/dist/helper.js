'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

// 如果是对象，则取 name 属性值
var mapString = exports.mapString = function mapString(item) {
    return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item.name : item;
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

// 获取资源链接头和尾部组合, 如：app_css
var getFirstAndEnd = function getFirstAndEnd(asset) {
    var flatAsset = mapString(asset);
    var arr = flatAsset.split('.');
    return arr[0] + '_' + arr[arr.length - 1];
};
// 处理同 chunk 的多个资源文件, 主要处理 hmr 的场景
var uniqAssets = exports.uniqAssets = function uniqAssets(arr) {
    // webpack5 assets 为对象 { name: 'app.js' }
    // 获取资源名, 区分后缀
    var narr = arr.map(function (item) {
        return getFirstAndEnd(item);
    });
    var obj = {};
    var resArr = [];
    narr.forEach(function (item, i) {
        var curItem = obj[item];
        if (!curItem) {
            resArr.push(item);
            obj[item] = arr[i];
        } else {
            var itemurl = mapString(arr[i]).split('.');
            var prevurl = mapString(curItem).split('.');
            // 取短的
            if (prevurl.length > itemurl.length) {
                obj[item] = arr[i];
            }
        }
    });
    return resArr.map(function (item) {
        return obj[item];
    });
};

// 合并2个路径
var joinPath = exports.joinPath = function joinPath(path, filename) {
    var gap = path.slice(-1) === '/' ? '' : '/';
    return '' + path + gap + filename;
};

var httpReg = /^http(s)?\:/i; // eslint-disable-line
// 添加 http
var getHttpHeader = exports.getHttpHeader = function getHttpHeader(url) {
    if (httpReg.test(url)) {
        return url;
    }
    return 'http:' + url;
};

var isObject = function isObject(v) {
    return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && v !== null;
};
var isArray = function isArray(obj) {
    return obj instanceof Array;
};
// clone object
var clone = exports.clone = function clone(obj) {
    var hasObj = isObject(obj);
    var hasArr = isArray(obj);
    if (!hasObj && !hasArr) {
        return obj;
    }
    var newobj = hasArr ? [] : {};
    var arr = hasArr ? obj : Object.keys(obj);
    arr.forEach(function (item, idx) {
        var curitem = hasArr ? item : obj[item];
        var val = isObject(curitem) || isArray(curitem) ? clone(curitem) : curitem;
        if (hasArr) {
            newobj[idx] = val;
        } else {
            newobj[item] = val;
        }
    });
    return newobj;
};