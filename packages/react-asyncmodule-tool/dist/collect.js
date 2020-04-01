'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactAsyncmodule = require('react-asyncmodule');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * 根据 chunkName 获取对应的 assets
 * chunkName, 当前需要提取 assets 的 chunk 名称
 * entrypoints, 入口文件
 * stats, webpack 生成的文件索引
 * runtimeName, 入口索引文件，默认`runtime`
 */
var Collect = function () {
    function Collect() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Collect);

        var chunkName = option.chunkName,
            entrypoints = option.entrypoints,
            asyncChunkKey = option.asyncChunkKey,
            outputPath = option.outputPath,
            _option$runtimeName = option.runtimeName,
            runtimeName = _option$runtimeName === undefined ? 'runtime' : _option$runtimeName,
            _option$stats = option.stats,
            stats = _option$stats === undefined ? {} : _option$stats;

        this.asyncChunkKey = asyncChunkKey;
        this.stats = stats;
        this.chunks = chunkName ? Array.isArray(chunkName) ? chunkName : [chunkName] : [];
        // 默认获取 stats 中 entrypoints 的第一个
        this.entrypoints = Array.isArray(entrypoints) ? entrypoints : [entrypoints || Object.keys(stats.entrypoints)[0]];
        this.runtimeName = Array.isArray(runtimeName) ? runtimeName : [runtimeName];
        this.outputPath = outputPath || stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssetsByName();
    }

    _createClass(Collect, [{
        key: 'createCollectChunk',
        value: function createCollectChunk(asset) {
            var publicPath = this.stats.publicPath;

            return {
                name: asset.split('.')[0],
                filename: asset,
                path: (0, _helper.joinPath)(this.outputPath, asset),
                url: (0, _helper.joinPath)(publicPath, asset)
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
            var lastAssets = (0, _helper.uniq)(tassets);
            return lastAssets.map(function (item) {
                return _this.createCollectChunk(item);
            });
        }
    }, {
        key: 'getRelatedChunk',
        value: function getRelatedChunk() {
            var chunks = this.chunks,
                entrypoints = this.entrypoints,
                runtimeName = this.runtimeName;
            var namedChunkGroups = this.stats.namedChunkGroups;
            // chunks可能是数字，不是字符串，故需要通过 assets 来获取对应的 chunk

            var realEnterpoints = [];
            var realRuntimeName = [];
            entrypoints.forEach(function (item, n) {
                var curchunks = namedChunkGroups[item].chunks;
                // 只保留js，过滤其余的 css 或者 map 等
                var curassets = namedChunkGroups[item].assets.filter(_helper.filterJs).map(function (item) {
                    return item.split('.')[0];
                });
                var renpIdx = curassets.findIndex(function (as) {
                    return as === item;
                });
                if (renpIdx > -1) {
                    realEnterpoints.push(curchunks[renpIdx]);
                }
                var runIdx = curassets.findIndex(function (as) {
                    return as === runtimeName[n];
                });
                if (runIdx > -1) {
                    realRuntimeName.push(curchunks[runIdx]);
                }
            });
            // webpack打包 chunk 依赖有遗漏，把 entrypoints 也传入
            var tchunks = [].concat(entrypoints, chunks);
            var rchunks = tchunks.reduce(function (prev, cur) {
                var curChunks = namedChunkGroups[cur].chunks;
                return prev.concat(curChunks);
            }, []).filter(function (item) {
                return realEnterpoints.indexOf(item) === -1;
            }) // 去掉入口文件
            .filter(function (item) {
                return realRuntimeName.indexOf(item) === -1;
            }); // 去掉 runtime
            var lastChunks = (0, _helper.uniq)(rchunks);
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
            return '<script id="' + (0, _reactAsyncmodule.getAsyncChunkKey)(this.asyncChunkKey) + '" type="application/json">' + this.getAsyncChunksStr() + '</script>';
        }
    }, {
        key: 'getInlineStyles',
        value: function getInlineStyles() {
            var assets = this.assets;

            var mainLinks = assets.filter(function (item) {
                return (0, _helper.filterCss)(item.url);
            }).map(function (item) {
                return new Promise(function (resolve, reject) {
                    _fs2.default.readFile(item.path, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({ data: data, url: item.url });
                    });
                });
            });
            return Promise.all(mainLinks).then(function (res) {
                return res.map(function (item) {
                    return (0, _helper.mapStyle)(item.data, item.url);
                });
            }).then(function (res) {
                return res.join('');
            });
        }
    }, {
        key: 'getStyles',
        value: function getStyles() {
            var assets = this.assets;

            var mainLink = assets.filter(function (item) {
                return (0, _helper.filterCss)(item.url);
            }).map(function (item) {
                return (0, _helper.mapLink)(item.url);
            });
            return mainLink.join('');
        }
    }, {
        key: 'getScripts',
        value: function getScripts() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$hasRuntime = _ref.hasRuntime,
                hasRuntime = _ref$hasRuntime === undefined ? false : _ref$hasRuntime;

            var assets = this.assets,
                runtimeName = this.runtimeName;

            var mainScript = assets.filter(function (item) {
                return (0, _helper.filterJs)(item.url);
            }).filter(function (item) {
                return hasRuntime ? true : runtimeName.indexOf(item.name) === -1;
            }).map(function (item) {
                return (0, _helper.mapScript)(item.url, true);
            });
            return [this.getAsyncChunks()].concat(mainScript).join('');
        }
    }]);

    return Collect;
}();

var create = exports.create = function create(option) {
    return new Collect(option);
};
exports.default = Collect;