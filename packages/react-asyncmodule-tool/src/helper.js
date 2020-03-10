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
export const mapScript = (item, isAsync = false) => {
    const asyncAttribute = typeof isAsync === 'boolean' && isAsync ? ' async ' : ' ';
    return `<script type="text/javascript"${asyncAttribute}src="${item}"></script>`;
}

// 生成完成的 style
export const mapStyle = (item, url) => `<style data-href="${url}" type="text/css">${item}</style>`;

// 生成完整的 link 格式
export const mapLink = item => `<link href="${item}" rel="stylesheet">`;

// 去除数组的重复数据，未考虑数字和字符串的差别，故只适用于该场景
export const uniq = (arr) => {
    const obj = {};
    const narr = [];
    arr.forEach((item) => {
        if (!obj[item]) {
            narr.push(item);
            obj[item] = 1;
        }
    });
    return narr;
}

// 合并2个路径
export const joinPath = (path, filename) => {
    const gap = path.slice(-1) === '/' ? '' : '/';
    return `${path}${gap}${filename}`;
}
