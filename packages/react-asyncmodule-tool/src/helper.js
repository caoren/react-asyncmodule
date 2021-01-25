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

// 如果是对象，则取 name 属性值
export const mapString = item => typeof item === 'object' ? item.name : item;

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

// 获取资源链接头和尾部组合, 如：app_css
const getFirstAndEnd = (asset) => {
    const arr = asset.split('.');
    return `${arr[0]}_${arr[arr.length - 1]}`;
}
// 处理同 chunk 的多个资源文件, 主要处理 hmr 的场景
export const uniqAssets = (arr) => {
    // 获取资源名, 区分后缀
    const narr = arr.map(item => getFirstAndEnd(item));
    const obj = {};
    const resArr = [];
    narr.forEach((item, i) => {
        const curItem = obj[item];
        if (!curItem) {
            resArr.push(item);
            obj[item] = arr[i];
        } else {
            const itemurl = arr[i].split('.');
            const prevurl = curItem.split('.');
            // 取短的
            if (prevurl.length > itemurl.length) {
                obj[item] = arr[i];
            }
        }
    });
    return resArr.map(item => obj[item]);
}

// 合并2个路径
export const joinPath = (path, filename) => {
    const gap = path.slice(-1) === '/' ? '' : '/';
    return `${path}${gap}${filename}`;
}

const httpReg = /^http(s)?\:/i; // eslint-disable-line
// 添加 http
export const getHttpHeader = (url) => {
    if (httpReg.test(url)) {
        return url;
    }
    return `http:${url}`;
}

const isObject = v => typeof v === 'object' && v !== null;
const isArray =  obj => obj instanceof Array;
// clone object
export const clone = (obj) => {
    const hasObj = isObject(obj);
    const hasArr = isArray(obj);
    if (!hasObj && !hasArr) {
        return obj;
    }
    let newobj = hasArr ? [] : {};
    const arr = hasArr ? obj : Object.keys(obj);
    arr.forEach((item, idx) => {
        const curitem = hasArr ? item : obj[item];
        const val = isObject(curitem) || isArray(curitem) ? clone(curitem) : curitem;
        if (hasArr) {
            newobj[idx] = val
        } else {
            newobj[item] = val;
        }
    });
    return newobj; 
}