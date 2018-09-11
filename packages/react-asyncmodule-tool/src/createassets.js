const isArray = (arr) => {
    if (typeof arr !== 'object') {
        return false;
    }
    return arr instanceof Array;
}
const arrayFind = (arr, func) => {
    if (!isArray(arr)) {
        return undefined;
    }
    const len = arr.length;
    let res;
    for (let i = 0; i < len; i += 1) {
        if (func(arr[i], i, arr)) {
            res = arr[i];
            break;
        }
    }
    return res;
}
const strEndswith = (str = '', key, len) => {
    let slen = len;
    if (len === undefined || len > str.length) {
        slen = str.length;
    }
    return str.substring(slen - key.length, len) === key;
}
/*
 * fetch css chunks
 * compilation's chunks and Stats's chunks is diff
 * compilation is `name`
 * Stats is `names`
 */
const createAssets = (chunks = [], publicPath = '') => {
    return chunks.reduce((hash, { name, names = [], files }) => {
        const nhash = hash;
        if (!isArray(files)) {
            return nhash;
        }
        const sname = name ? name : names[0];
        if (!sname) {
            return nhash;
        }
        const findCssFile = arrayFind(files, file => strEndswith(file, '.css'));
        if (findCssFile) {
            nhash.css[sname] = `${publicPath}${findCssFile}`;
        }
        const findJsFile = arrayFind(files, file => strEndswith(file, '.js'));
        if (findJsFile) {
            nhash.js[sname] = `${publicPath}${findJsFile}`;
        }
        return nhash;
    }, { js: {}, css: {}});
};
export default createAssets;