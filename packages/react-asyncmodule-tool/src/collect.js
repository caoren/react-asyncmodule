import { getAsyncChunkKey } from 'react-asyncmodule';
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

/*
 * 根据 chunkName 获取对应的 assets
 * chunkName, 当前需要提取 assets 的 chunk 名称
 * entrypoints, 入口文件
 * stats, webpack 生成的文件索引
 * runtimeName, 入口索引文件，默认`runtime`
 */
class Collect {
    constructor(option = {}) {
        const {
            chunkName,
            entrypoints,
            asyncChunkKey,
            outputPath,
            runtimeName = 'runtime',
            stats = {}
        } = option;
        this.asyncChunkKey = asyncChunkKey;
        this.stats = stats;
        this.chunks = chunkName ? (Array.isArray(chunkName) ? chunkName : [chunkName]) : [];
        // 默认获取 stats 中 entrypoints 的第一个
        this.entrypoints = Array.isArray(entrypoints) ? entrypoints : [entrypoints || Object.keys(stats.entrypoints)[0]];
        this.runtimeName = Array.isArray(runtimeName) ? runtimeName : [runtimeName];
        this.outputPath = outputPath || stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssetsByName();
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

    getAssetsByName() {
        const { namedChunkGroups } = this.stats;
        const tchunks = [].concat(this.entrypoints, this.chunks);

        const tassets = tchunks.reduce((prev, item) => {
            const { assets } = namedChunkGroups[item];
            return prev.concat(assets);
        }, []).map(mapString);
        const lastAssets = uniq(tassets);
        return lastAssets.map(item => this.createCollectChunk(item));
    }
    
    getRelatedChunk() {
        const { chunks, entrypoints, runtimeName } = this;
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
        // webpack打包 chunk 依赖有遗漏，把 entrypoints 也传入
        const tchunks = [].concat(entrypoints, chunks);
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
        return mainLink.join('');
    }

    getScripts({ hasRuntime = false } = {}) {
        const { assets, runtimeName } = this;
        const mainScript = assets
            .filter(item => filterJs(item.url))
            .filter(item => hasRuntime ? true : runtimeName.indexOf(item.name) === -1)
            .map(item => mapScript(item.url, true));
        return [this.getAsyncChunks()].concat(mainScript).join('');
    }
}
export const create = (option) => {
    return new Collect(option);
}
export default Collect;
