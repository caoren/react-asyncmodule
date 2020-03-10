var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { getAsyncChunkKey } from 'react-asyncmodule';
import fs from 'fs';
import { filterJs, filterCss, mapScript, mapLink, mapStyle, uniq, joinPath } from './helper';

/*
 * 根据 chunkName 获取对应的 assets
 * chunkName, 当前需要提取 assets 的 chunk 名称
 * entrypoints, 入口文件
 * stats, webpack 生成的文件索引
 */

var Collect = function () {
    function Collect() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Collect);

        var chunkName = option.chunkName,
            entrypoints = option.entrypoints,
            asyncChunkKey = option.asyncChunkKey,
            _option$stats = option.stats,
            stats = _option$stats === undefined ? {} : _option$stats;

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

    _createClass(Collect, [{
        key: 'createCollectChunk',
        value: function createCollectChunk(asset) {
            var _stats = this.stats,
                publicPath = _stats.publicPath,
                outputPath = _stats.outputPath;

            return {
                name: asset,
                path: joinPath(outputPath, asset),
                url: joinPath(publicPath, asset)
            };
        }
    }, {
        key: 'getAssetsByName',
        value: function getAssetsByName() {
            var _this = this;

            var namedChunkGroups = this.stats.namedChunkGroups;

            var tchunks = [].concat(this.entrypoints, this.chunks);
            var tassets = tchunks.reduce(function (prev, item) {
                var assets = namedChunkGroups[item].assets;

                return prev.concat(assets);
            }, []);
            var lastAssets = uniq(tassets);
            return lastAssets.map(function (item) {
                return _this.createCollectChunk(item);
            });
        }
    }, {
        key: 'getRelatedChunk',
        value: function getRelatedChunk() {
            var chunks = this.chunks;
            var namedChunkGroups = this.stats.namedChunkGroups;

            var rchunks = chunks.reduce(function (prev, cur) {
                var curChunks = namedChunkGroups[cur].chunks;
                return prev.concat(curChunks);
            }, []);
            var lastChunks = uniq(rchunks);
            return lastChunks;
        }
    }, {
        key: 'getAsyncChunksStr',
        value: function getAsyncChunksStr() {
            return JSON.stringify(this.getRelatedChunk());
        }
    }, {
        key: 'getAsyncChunks',
        value: function getAsyncChunks() {
            return '<script id="' + getAsyncChunkKey(this.asyncChunkKey) + '" type="application/json">' + this.getAsyncChunksStr() + '</script>';
        }
    }, {
        key: 'getInlineStyles',
        value: function getInlineStyles() {
            var assets = this.assets;

            var mainLinks = assets.filter(function (item) {
                return filterCss(item.url);
            }).map(function (item) {
                return new Promise(function (resolve, reject) {
                    fs.readFile(item.path, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                });
            });
            return Promise.all(mainLinks).then(function (res) {
                return res.map(mapStyle);
            }).then(function (res) {
                return res.join('');
            });
        }
    }, {
        key: 'getStyles',
        value: function getStyles() {
            var assets = this.assets;

            var mainLink = assets.filter(function (item) {
                return filterCss(item.url);
            }).map(function (item) {
                return mapLink(item.url);
            });
            return mainLink.join('');
        }
    }, {
        key: 'getScripts',
        value: function getScripts() {
            var assets = this.assets;

            var mainScript = assets.filter(function (item) {
                return filterJs(item.url);
            }).map(function (item) {
                return mapScript(item.url, true);
            });
            return [this.getAsyncChunks()].concat(mainScript).join('');
        }
    }]);

    return Collect;
}();

export var create = function create(option) {
    return new Collect(option);
};
export default Collect;