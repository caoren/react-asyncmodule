import { getAsyncChunkKey, getAsyncModuleName } from 'react-asyncmodule';
import collectMap from './resourcemap';
import fs from 'fs';
import {
    filterJs,
    filterCss,
    mapScript,
    mapLink,
    mapStyle,
    uniq,
    joinPath,
    mapString
} from './helper';

// stats 中的 chunk 存在id(数字)和name(字符串)两种情况
const getChunkByName = (idx, chunks) => {
    if (typeof idx === 'string') {
        const res = chunks.filter(item => item.id === idx);
        return res[0];
    }
    return chunks[idx];
}

const connectNameGroupsFromChunks = (stats) => {
    const { chunks = [], namedChunkGroups } = stats;
    Object.keys(namedChunkGroups).forEach((item) => {
        // chunk 名和 asset 名不一定相等
        const itemChunks = namedChunkGroups[item].chunks;
        const itemAssets = namedChunkGroups[item].assets;
        const insChunks = [];
        const insAssets = [];
        itemChunks.forEach((chk) => {
            /*
             * 从 stats 中的 chunks 中获取该 chunk 的依赖
             * chunk 中的 parents 就是依赖，该属性值存储的是 chunks 数组的下标
             */
            const { parents } = getChunkByName(chk, chunks) || {};
            if (parents && parents.length > 0) {
                // 从 chunks 获取 parents 的资源文件
                parents.forEach((child) => {
                    /*
                     * entry 表示为入口chunk, federation 是 remote 依赖，故 files 为空
                     * 过滤入口 chunk，过滤 federation 的依赖
                     */
                    const { entry, files } = getChunkByName(child, chunks) || {};
                    if (!entry && files && files.length > 0) {
                        insChunks.push(child);
                        insAssets.push.apply(insAssets, files);
                    }
                });
            }
        });
        if (insChunks.length > 0) {
            // chunk 间的 parents 可能存在重复，加上去重
            itemChunks.unshift.apply(itemChunks, uniq(insChunks))
            namedChunkGroups[item].chunks = itemChunks;
        }
        if (insAssets.length > 0) {
            // 同上
            itemAssets.unshift.apply(itemAssets, uniq(insAssets));
            namedChunkGroups[item].assets = itemAssets;
        }
    });
    return stats;
}
/*
 * 根据 chunkName 获取对应的 assets
 * chunkName, 当前需要提取 assets 的 chunk 名称
 * entrypoints, 入口文件
 * asyncChunkKey, 前端脚本依赖 json 的 id，默认为 react-asyncmodule 的 `__ASYNC_MODULE_CHUNKS__`
 * asyncModuleName, 前端脚本依赖的 chunk 数组，默认为 react-asyncmodule 的 `__ASYNC_MODULE_NAMES__`
 * outputPath, assets cdn path, 默认为 stats 中的 outputPath
 * runtimeName, 入口索引文件，默认`runtime`
 * isFederation, 是否为 federation 场景，是的话则不输出 script chunk 到页面上
 * stats, webpack 生成的文件索引
 * extraStats, 额外的 stats, 比如 federation 的 stats
 */
class Collect {
    constructor(option = {}) {
        const {
            chunkName,
            entrypoints,
            asyncChunkKey,
            asyncModuleName,
            outputPath,
            extraStats = {},
            runtimeName = 'runtime',
            isFederation = false,
            stats = {}
        } = option;
        this.isFederation = isFederation;
        this.asyncChunkKey = asyncChunkKey;
        this.asyncModuleName = asyncModuleName;
        this.stats = connectNameGroupsFromChunks(stats);
        this.chunks = chunkName ? (Array.isArray(chunkName) ? chunkName : [chunkName]) : [];
        // 默认获取 stats 中 entrypoints 的第一个
        this.entrypoints = Array.isArray(entrypoints) ? entrypoints : [entrypoints || Object.keys(stats.entrypoints)[0]];
        this.runtimeName = Array.isArray(runtimeName) ? runtimeName : [runtimeName];
        this.outputPath = outputPath || stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssetsByName();
        this.assetsExtra = isFederation ? this.getAsstesByExtra(this.stats, extraStats) : [];
        this.assetsLite = this.getAssetsByName(isFederation);
    }

    createCollectChunk(asset) {
        const { publicPath } = this.stats;
        return {
            name: asset.split('.')[0],
            filename: asset,
            path: joinPath(this.outputPath, asset),
            url: joinPath(publicPath, asset)
        }
    }

    getAsstesByExtra(stats, extraStats) {
        const { chunks } = this;
        const { remotesGraph } = stats;
        const { currentExposes, chunks: extraChunks, publicPath: extraPath } = extraStats;
        // 根据 chunks 从 remotesGraph 获取依赖的 federation module
        const deps = chunks.reduce((prev, item) => {
            const modules = remotesGraph[item];
            return prev.concat(modules.map(item => item.name));
        }, []);
        console.log('=deps=', deps);
        // 根据 deps 获取相应的 chunks
        const depsChunks = uniq(deps.reduce((prev, item) => {
            const curdDep = currentExposes[item];
            console.log('=curdDep=', curdDep);
            return prev.concat(curdDep);
        }, []));
        console.log('=depsChunks=', depsChunks);
        // 在 extraStats 中获取 chunk 路径
        const styleAssets = depsChunks.reduce((prev, item) => {
            const { parents, files: curFiles } = getChunkByName(item, extraChunks) || {};
            prev.push.apply(prev, curFiles);
            if (parents && parents.length > 0) {
                // 从 chunks 获取 parents 的资源文件
                parents.forEach((child) => {
                    /*
                     * entry 表示为入口chunk, federation 是 remote 依赖，故 files 为空
                     * 过滤入口 chunk，过滤 federation 的依赖
                     */
                    const { entry, files } = getChunkByName(child, chunks) || {};
                    if (!entry && files && files.length > 0) {
                        prev.push.apply(prev, files);
                    }
                });
            }
            return prev;
        }, [])
        .filter(filterCss)
        .map(item => `${extraPath}${item}`);
        console.log('=styleAssets=', styleAssets);
        return styleAssets.map(mapLink);
    }

    getAssetsByName(isFederation) {
        const { namedChunkGroups } = this.stats;
        const tchunks = [].concat(this.entrypoints, isFederation ? [] : this.chunks);

        const tassets = tchunks.reduce((prev, item) => {
            const { assets } = namedChunkGroups[item];
            return prev.concat(assets);
        }, []).map(mapString);
        const lastAssets = uniq(tassets);
        return lastAssets.map(item => this.createCollectChunk(item));
    }
    
    getRelatedChunk() {
        const { chunks, entrypoints, runtimeName, isFederation } = this;
        const { namedChunkGroups } = this.stats;
        // chunks可能是数字，不是字符串，故需要通过 assets 来获取对应的 chunk
        const realEnterpoints = [];
        const realRuntimeName = [];
        entrypoints.forEach((item, n) => {
            const curchunks = namedChunkGroups[item].chunks;
            // 只保留js，过滤其余的 css 或者 map 等
            const curassets = namedChunkGroups[item].assets
                .map(mapString)
                .filter(filterJs)
                .map(item => item.split('.')[0]);
            const renpIdx = curassets.findIndex(as => as === item);
            if (renpIdx > -1) {
                realEnterpoints.push(curchunks[renpIdx]);
            }
            const runIdx = curassets.findIndex(as => as === runtimeName[n]);
            if (runIdx > -1) {
                realRuntimeName.push(curchunks[runIdx]);
            }
        });
        // webpack打包 chunk 依赖有遗漏，把 entrypoints 也传入，chunks不传入
        const tchunks = [].concat(entrypoints, isFederation ? [] : chunks);
        const rchunks = tchunks.reduce((prev, cur) => {
            const curChunks = namedChunkGroups[cur].chunks;
            return prev.concat(curChunks);
        }, [])
        .filter(item => realEnterpoints.indexOf(item) === -1) // 去掉入口文件
        .filter(item => realRuntimeName.indexOf(item) === -1); // 去掉 runtime
        const lastChunks = uniq(rchunks);
        return lastChunks;
    }

    getAsyncChunksStr() {
        return JSON.stringify(this.getRelatedChunk());
    }

    getAsyncChunks() {
        return `<script id="${getAsyncChunkKey(this.asyncChunkKey)}" type="application/json">${this.getAsyncChunksStr()}</script>`;
    }

    getAsyncModulesStr() {
        return JSON.stringify(this.chunks);
    }

    getAsyncModules() {
        return `<script id="${getAsyncModuleName(this.asyncModuleName)}" type="application/json">${this.getAsyncModulesStr()}</script>`;
    }

    getInlineStyles() {
        const { assets } = this;
        const mainLinks = assets
            .filter(item => filterCss(item.url));
        const cssMap = collectMap.getCSSMap();
        if (cssMap) {
            return mainLinks.map((item) => {
                return {
                    data: cssMap[item.path],
                    url: item.url
                }
            }).map(item => mapStyle(item.data, item.url)).join('');
        } else {
            const linksPromises = mainLinks.map(item => new Promise((resolve, reject) => {
                    fs.readFile(item.path, 'utf8', (err, data) => {
                        if (err) {
                            reject(err)
                            return;
                        }
                        resolve({ data, url: item.url });
                    });
                }));
            return Promise.all(linksPromises)
                .then(res => res.map(item => mapStyle(item.data, item.url)))
                .then(res => res.join(''));
        }
    }

    getStyles() {
        const { assets } = this;
        const mainLink = assets
            .filter(item => filterCss(item.url))
            .map(item => mapLink(item.url));
        return this.assetsExtra.concat(mainLink).join('');
    }

    getScripts({ hasRuntime = false } = {}) {
        const { chunks, assetsLite, runtimeName, isFederation } = this;
        const mainScript = assetsLite
            .filter(item => filterJs(item.url))
            .filter(item => hasRuntime ? true : runtimeName.indexOf(item.name) === -1)
            .filter(item => chunks.indexOf(item.name) === -1)
            .map(item => mapScript(item.url, true));
        return [isFederation ? this.getAsyncModules() : this.getAsyncChunks()].concat(mainScript).join('');
    }
}
export const create = (option) => {
    return new Collect(option);
}
export default Collect;
