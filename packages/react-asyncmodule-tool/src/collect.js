import { getAsyncChunkKey, getAsyncModuleName } from 'react-asyncmodule';
import collectMap from './resourcemap';
import fs from 'fs';
import http from 'http';
import {
    filterJs,
    filterCss,
    mapScript,
    mapLink,
    mapStyle,
    uniq,
    uniqAssets,
    joinPath,
    mapString,
    clone,
    getHttpHeader
} from './helper';

// stats 中的 chunk 存在id(数字)和name(字符串)两种情况，判断 id 的值最准确
const getChunkByName = (idx, chunks) => {
    const res = chunks.filter(item => item.id === idx);
    return res[0];
}

const connectNameGroupsFromChunks = (stats) => {
    const newstats = clone(stats);
    const { chunks = [], namedChunkGroups } = newstats;
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
            const uniqInsChunks = uniq(insChunks);
            uniqInsChunks.forEach((item) => {
                // itemChunks 不存在相同的 item
                if (itemChunks.indexOf(item) === -1) {
                    itemChunks.unshift(item);
                }
            });
            namedChunkGroups[item].chunks = itemChunks;
        }
        if (insAssets.length > 0) {
            // 同上
            const uniqInsAssets = uniq(insAssets);
            uniqInsAssets.forEach((item) => {
                // webpack5 的 assets 存在对象, { "name": 'app.js' }，先抹平
                const flatItemAssets = itemAssets.map(mapString);
                // itemAssets 不存在相同的 item, 则添加
                if (flatItemAssets.indexOf(mapString(item)) === -1) {
                    itemAssets.unshift(item);
                }
            });
            namedChunkGroups[item].assets = uniqAssets(itemAssets);
        }
    });
    return newstats;
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
            extraStats,
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
        this.outputPath = outputPath || this.stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssetsByName();
        this.assetsExtra = isFederation && extraStats ? this.getAsstesByExtra(this.stats, extraStats) : [];
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
        const { remotesMap } = stats;
        const { exposesMap, chunks: extraChunks, publicPath: extraPath } = extraStats;
        // 根据 chunks 从 remotesMap 获取依赖的 federation module
        const deps = remotesMap ? chunks.reduce((prev, item) => {
            const modules = remotesMap[item];
            return prev.concat(modules.map(item => item.name));
        }, []) : [];
        if (deps.length === 0) {
            return deps;
        }
        // 根据 deps 获取相应的 chunks
        const depsChunks = uniq(deps.reduce((prev, item) => {
            const curdDep = exposesMap ? exposesMap[item] : [];
            return prev.concat(curdDep);
        }, []));
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
        return styleAssets;
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
        // chunks可能是数字，不是字符串，故需要通过 assets 所在的数组下标来获取对应的 chunk
        const realEnterpoints = [];
        const realRuntimeName = [];
        entrypoints.forEach((item, n) => {
            const curchunks = namedChunkGroups[item].chunks;
            // 只保留js，过滤其余的 css 或者 map 等, dev 时存在 hot-update.js，需要过滤相同 chunk
            const curassets = uniq(namedChunkGroups[item].assets
                .map(mapString)
                .filter(filterJs)
                .map(item => item.split('.')[0]));
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
        const { assets, isFederation, assetsExtra } = this;
        const mainLinks = assets
            .filter(item => filterCss(item.url));
        const cssMap = collectMap.getCSSMap();
        if (isFederation) {
            const totalLink = mainLinks.concat(assetsExtra);
            const promises = totalLink.map((item) => {
                const isStr = typeof item === 'string';
                const key = isStr ? item : item.path;
                if (cssMap && cssMap[key]) {
                    return Promise.resolve({
                        data: cssMap[key],
                        url: isStr ? item : item.url
                    });
                } else {
                    return new Promise((resolve, reject) => {
                        if (isStr) {
                            http.get(getHttpHeader(item), (res) => {
                                const { statusCode } = res;
                                if (statusCode < 200 || statusCode >= 300) {
                                    reject(new Error('request failed'));
                                    res.resume();
                                    return;
                                }
                                let rawData = '';
                                res.on('data', (chunk) => { rawData += chunk; });
                                res.on('end', () => {
                                    collectMap.setCSSMap(item, rawData);
                                    resolve({ data: rawData, url: item });
                                });
                            }).on('error', (e) => {
                                reject(e);
                            });
                        } else {
                            fs.readFile(item.path, 'utf8', (err, data) => {
                                if (err) {
                                    reject(err)
                                    return;
                                }
                                collectMap.setCSSMap(item.path, data);
                                resolve({ data, url: item.url });
                            });
                        }
                    });
                }
            });
            return Promise.all(promises)
                .then(res => res.map(item => mapStyle(item.data, item.url)))
                .then(res => res.join(''));
        }
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
        const extraLink = this.assetsExtra.map(mapLink);
        return mainLink.concat(extraLink).join('');
    }

    getScripts({ hasRuntime = false } = {}) {
        const { assetsLite, runtimeName, isFederation } = this;
        const mainScript = assetsLite
            .filter(item => filterJs(item.url))
            .filter(item => hasRuntime ? true : runtimeName.indexOf(item.name) === -1)
            .map(item => mapScript(item.url, true));
        return [isFederation ? this.getAsyncModules() : this.getAsyncChunks()].concat(mainScript).join('');
    }
}
export const create = (option) => {
    return new Collect(option);
}
export default Collect;
