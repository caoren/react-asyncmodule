// entry unique
export const ENTRYKEY = '@ENTRY';

// 判断当前字符串(str)是否是以另外一个给定的子字符(key)串结尾
export const strEndswith = (str = '', key = '') => {
    const slen = str.length;
    return str.substring(slen - key.length, slen) === key;
};

export const filterAssets = assets => item => strEndswith(item, assets);

// 是否以`.js` 结尾
export const filterJs = filterAssets('.js');

// 是否以 `.css` 结尾
export const filterCss = filterAssets('.css');

// 生成完整的 script 格式
export const mapScript = item => `<script type="text/javascript" src="${item}"></script>`;

// 生成完整的 link 格式
export const mapLink = item => `<link href="${item}" rel="stylesheet">`;