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
const exportAssets = (chunks, names) => {
    const res = {};
    ASSETSTYPES.forEach((item) => {
        res[item] = getAssets(chunks, names, item);
    });
    return res;
};
export default exportAssets;