/*
 * stats 为 webpack 的 Compiler.hooks.done 回调中传入
 * entrypoints 对应 entry
 * nameChunksGroups 对应所有的chunk
 * publicPath 对应 webpack 的 output 配置下的publicPath
 */
import { ENTRYKEY, filterJs, filterCss } from './helper';
const createAssets = (stats = {}) => {
    const { entrypoints, namedChunkGroups = {}, publicPath } = stats;
    // 拼接完整url
    const addPublicPath = item => `${publicPath}${item}`;
    const entryKey = entrypoints ? Object.keys(entrypoints)[0] : '@NOTFOUND';
    const entryChunks = namedChunkGroups[entryKey];
    // 去除runtime(runtime建议内联到html中)
    const entryAssets = entryChunks ? entryChunks.assets.filter(item => item.indexOf('runtime') === -1) : [];
    const totalAssets = {
        [ENTRYKEY]: {
            js: entryAssets.filter(filterJs).map(addPublicPath),
            css: entryAssets.filter(filterCss).map(addPublicPath)
        }
    };
    Object.keys(namedChunkGroups).forEach((item) => {
        let { assets } = namedChunkGroups[item];
        if (!Array.isArray(assets)) {
            return;
        }
        // 去除已在 entry 中的资源
        assets = assets.filter(res => entryAssets.indexOf(res) === -1);
        const jsAssets = assets.filter(filterJs).map(addPublicPath);
        const cssAssets = assets.filter(filterCss).map(addPublicPath);
        if (jsAssets.length || cssAssets.length) {
            totalAssets[item] = {};
            totalAssets[item].js = jsAssets;
            totalAssets[item].css = cssAssets;
        }
    });
    return totalAssets;
};
export default createAssets;
