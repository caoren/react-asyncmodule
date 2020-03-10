import { getAsyncChunkKey } from 'react-asyncmodule';
import fs from 'fs';
import {
    filterJs,
    filterCss,
    mapScript,
    mapLink,
    mapStyle,
    uniq,
    joinPath
} from './helper';

/*
 * 根据 chunkName 获取对应的 assets
 * chunkName, 当前需要提取 assets 的 chunk 名称
 * entrypoints, 入口文件
 * stats, webpack 生成的文件索引
 */
class Collect {
    constructor(option = {}) {
        const {
            chunkName,
            entrypoints,
            asyncChunkKey,
            stats = {}
        } = option;
        if (!chunkName) {
            throw new Error('`chunkName` must be existed');
        }
        this.asyncChunkKey = asyncChunkKey;
        this.stats = stats;
        this.chunks = Array.isArray(chunkName) ? chunkName : [chunkName];
        // 默认获取 stats 中 entrypoints 的第一个
        this.entrypoints = Array.isArray(entrypoints) ? entrypoints : [entrypoints || Object.keys(stats.entrypoints)[0]];
        // 根据获取对应的 assets
        this.assets = this.getAssetsByName();
    }

    createCollectChunk(asset) {
        const { publicPath, outputPath } = this.stats;
        return {
            name: asset,
            path: joinPath(outputPath, asset),
            url: joinPath(publicPath, asset)
        }
    }

    getAssetsByName() {
        const { namedChunkGroups } = this.stats;
        const tchunks = [].concat(this.entrypoints, this.chunks);
        const tassets = tchunks.reduce((prev, item) => {
            const { assets } = namedChunkGroups[item];
            return prev.concat(assets);
        }, []);
        const lastAssets = uniq(tassets);
        return lastAssets.map(item => this.createCollectChunk(item));
    }
    
    getRelatedChunk() {
        const { chunks } = this;
        const { namedChunkGroups } = this.stats;
        const rchunks = chunks.reduce((prev, cur) => {
            const curChunks = namedChunkGroups[cur].chunks;
            return prev.concat(curChunks);
        }, []);
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
            .filter(item => filterCss(item.url))
            .map(item => new Promise((resolve, reject) => {
                fs.readFile(item.path, 'utf8', (err, data) => {
                    if (err) {
                        reject(err)
                        return;
                    }
                    resolve({ data, url: item.url });
                });
            }));
        return Promise.all(mainLinks)
            .then(res => res.map(item => mapStyle(item.data, item.url)))
            .then(res => res.join(''));
    }

    getStyles() {
        const { assets } = this;
        const mainLink = assets
            .filter(item => filterCss(item.url))
            .map(item => mapLink(item.url));
        return mainLink.join('');
    }

    getScripts() {
        const { assets } = this;
        const mainScript = assets
            .filter(item => filterJs(item.url))
            .map(item => mapScript(item.url, true));
        return [this.getAsyncChunks()].concat(mainScript).join('');
    }
}
export const create = (option) => {
    return new Collect(option);
}
export default Collect;
