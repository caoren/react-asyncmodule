// entry unique
export var ENTRYKEY = '@ENTRY';

// 判断当前字符串(str)是否是以另外一个给定的子字符(key)串结尾
export var strEndswith = function strEndswith() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var slen = str.length;
    return str.substring(slen - key.length, slen) === key;
};

export var filterAssets = function filterAssets(assets) {
    return function (item) {
        return strEndswith(item, assets);
    };
};

// 是否以`.js` 结尾
export var filterJs = filterAssets('.js');

// 是否以 `.css` 结尾
export var filterCss = filterAssets('.css');

// 生成完整的 script 格式
export var mapScript = function mapScript(item) {
    return '<script type="text/javascript" src="' + item + '"></script>';
};

// 生成完整的 link 格式
export var mapLink = function mapLink(item) {
    return '<link href="' + item + '" rel="stylesheet">';
};