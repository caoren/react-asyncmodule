import { ENTRYKEY, mapScript, mapLink } from "./helper";

const getChunkAssets = (assets = {}, chunkName = '') => {
    const curAsset = assets[chunkName];
    const entryAsset = assets[ENTRYKEY];
    const entryJs = entryAsset ? entryAsset.js.map(mapScript) : [];
    const entryCss = entryAsset ? entryAsset.css.map(mapLink) : [];
    if (curAsset) {
        const { js, css } = curAsset;
        // entry的js加在最后, entry的css由于优先级关系加在前
        return {
            js: js.map(mapScript).concat(entryJs).join(''),
            css: entryCss.concat(css.map(mapLink)).join('')
        };
    }
    return {
        js: entryJs.join(''),
        css: entryCss.join('')
    };
};
export default getChunkAssets;
