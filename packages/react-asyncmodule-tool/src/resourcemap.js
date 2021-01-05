import fs from 'fs';
import {
    filterJs,
    filterCss,
    uniq,
    joinPath
} from './helper';

class ResourceMap {
    constructor(option = {}) {
        const {
            outputPath,
            stats = {}
        } = option;
        this.stats = stats;
        this.outputPath = outputPath || stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssets();
    }

    getAssets() {
        const { namedChunkGroups } = this.stats;
        const resources = Object.keys(namedChunkGroups).reduce((prev, item) => {
            const { assets } = namedChunkGroups[item];
            return prev.concat(assets);
        }, []);
        return {
            js: uniq(resources.filter(filterJs)).map(item => joinPath(this.outputPath, item)),
            css: uniq(resources.filter(filterCss)).map(item => joinPath(this.outputPath, item))
        }
    }

    getStyle() {
        return this.assets.css;
    }

    getScript() {
        return this.assets.js;
    }
}
const collectMap = function tmpMap() {
    let cssMap;
    return {
        getCSSMap() {
            return cssMap;
        },
        setCSSMap(key, data) {
            cssMap = cssMap || {};
            cssMap[key] = data;
        },
        prefetchCss(option) {
            const rsMap = new ResourceMap(option);
            const stylesPromises = rsMap.getStyle().map((item) => {
                return new Promise((resolve, reject) => {
                    fs.readFile(item, 'utf8', (err, data) => {
                        if (err) {
                            reject(err)
                            return;
                        }
                        resolve({ data, path: item });
                    });
                });
            });
            return Promise.all(stylesPromises).then((res) => {
                cssMap = {};
                res.forEach((item) => {
                    const { data, path } = item;
                    cssMap[path] = data;
                });
                return cssMap;
            });
        }
    }
}();
export { ResourceMap }
export default collectMap;