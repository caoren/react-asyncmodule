/*
 * 获取css chunks
 * compilation的chunks和Stats中的chunks有差别
 * compilation里是name
 * Stats里是names
 */
export const createAssetsHash = (chunks = [], publicPath = '') => {
    return chunks.reduce((hash, { name, names = [], files }) => {
        const nhash = hash;
        if (!Array.isArray(files)) {
            return nhash;
        }
        const sname = name ? name : names[0];
        if (!sname) {
            return nhash;
        }
        const findCssFile = files.find(file => file.endsWith('.css'));
        if (findCssFile) {
            nhash.css[sname] = `${publicPath}${findCssFile}`;
        }
        const findJsFile = files.find(file => file.endsWith('.js'));
        if (findJsFile) {
            nhash.js[sname] = `${publicPath}${findJsFile}`;
        }
        return nhash;
    }, { js: {}, css: {}});
};
const ASSETSTYPES = ['js', 'css'];
const getAssets = (chunks = {}, names = [], type) => {
    const obj = chunks[type];
    const method = (item) => {
        return type === 'css' ? `<link type="text/css" href="${item}" rel="stylesheet">` : `<script type="text/javascript" src="${item}"></script>`;
    };
    return names.map((item) => {
            return obj[item];
        })
        .filter(item => !!item)
        .map((item) => method(item))
        .join('');
};
// 根据names输出对应的js和css
export const exportAssets = (chunks, names) => {
    const res = {};
    ASSETSTYPES.forEach((item) => {
        res[item] = getAssets(chunks, names, item);
    });
    return res;
};