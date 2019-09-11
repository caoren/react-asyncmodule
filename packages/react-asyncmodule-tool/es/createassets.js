function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * stats 为 webpack 的 Compiler.hooks.done 回调中传入
 * entrypoints 对应 entry
 * nameChunksGroups 对应所有的chunk
 * publicPath 对应 webpack 的 output 配置下的publicPath
 */
import { ENTRYKEY, filterJs, filterCss } from './helper';
var createAssets = function createAssets() {
    var stats = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var entrypoints = stats.entrypoints,
        _stats$namedChunkGrou = stats.namedChunkGroups,
        namedChunkGroups = _stats$namedChunkGrou === undefined ? {} : _stats$namedChunkGrou,
        publicPath = stats.publicPath;
    // 拼接完整url

    var addPublicPath = function addPublicPath(item) {
        return '' + publicPath + item;
    };
    var entryKey = entrypoints ? Object.keys(entrypoints)[0] : '@NOTFOUND';
    var entryChunks = namedChunkGroups[entryKey];
    // 去除runtime(runtime建议内联到html中)
    var entryAssets = entryChunks ? entryChunks.assets.filter(function (item) {
        return item.indexOf('runtime') === -1;
    }) : [];
    var totalAssets = _defineProperty({}, ENTRYKEY, {
        js: entryAssets.filter(filterJs).map(addPublicPath),
        css: entryAssets.filter(filterCss).map(addPublicPath)
    });
    Object.keys(namedChunkGroups).forEach(function (item) {
        var assets = namedChunkGroups[item].assets;

        if (!Array.isArray(assets)) {
            return;
        }
        // 去除已在 entry 中的资源
        assets = assets.filter(function (res) {
            return entryAssets.indexOf(res) === -1;
        });
        var jsAssets = assets.filter(filterJs).map(addPublicPath);
        var cssAssets = assets.filter(filterCss).map(addPublicPath);
        if (jsAssets.length || cssAssets.length) {
            totalAssets[item] = {};
            totalAssets[item].js = jsAssets;
            totalAssets[item].css = cssAssets;
        }
    });
    return totalAssets;
};
export default createAssets;