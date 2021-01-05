'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactAsyncmodule = require('react-asyncmodule');

var _resourcemap = require('./resourcemap');

var _resourcemap2 = _interopRequireDefault(_resourcemap);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// stats 中的 chunk 存在id(数字)和name(字符串)两种情况
var getChunkByName = function getChunkByName(idx, chunks) {
    if (typeof idx === 'string') {
        var res = chunks.filter(function (item) {
            return item.id === idx;
        });
        return res[0];
    }
    return chunks[idx];
};

var connectNameGroupsFromChunks = function connectNameGroupsFromChunks(stats) {
    var newstats = (0, _helper.clone)(stats);
    var _newstats$chunks = newstats.chunks,
        chunks = _newstats$chunks === undefined ? [] : _newstats$chunks,
        namedChunkGroups = newstats.namedChunkGroups;

    Object.keys(namedChunkGroups).forEach(function (item) {
        // chunk 名和 asset 名不一定相等
        var itemChunks = namedChunkGroups[item].chunks;
        var itemAssets = namedChunkGroups[item].assets;
        var insChunks = [];
        var insAssets = [];
        itemChunks.forEach(function (chk) {
            /*
             * 从 stats 中的 chunks 中获取该 chunk 的依赖
             * chunk 中的 parents 就是依赖，该属性值存储的是 chunks 数组的下标
             */
            var _ref = getChunkByName(chk, chunks) || {},
                parents = _ref.parents;

            if (parents && parents.length > 0) {
                // 从 chunks 获取 parents 的资源文件
                parents.forEach(function (child) {
                    /*
                     * entry 表示为入口chunk, federation 是 remote 依赖，故 files 为空
                     * 过滤入口 chunk，过滤 federation 的依赖
                     */
                    var _ref2 = getChunkByName(child, chunks) || {},
                        entry = _ref2.entry,
                        files = _ref2.files;

                    if (!entry && files && files.length > 0) {
                        insChunks.push(child);
                        insAssets.push.apply(insAssets, files);
                    }
                });
            }
        });
        if (insChunks.length > 0) {
            // chunk 间的 parents 可能存在重复，加上去重
            itemChunks.unshift.apply(itemChunks, (0, _helper.uniq)(insChunks));
            namedChunkGroups[item].chunks = itemChunks;
        }
        if (insAssets.length > 0) {
            // 同上
            itemAssets.unshift.apply(itemAssets, (0, _helper.uniq)(insAssets));
            namedChunkGroups[item].assets = itemAssets;
        }
    });
    return newstats;
};
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

var Collect = function () {
    function Collect() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Collect);

        var chunkName = option.chunkName,
            entrypoints = option.entrypoints,
            asyncChunkKey = option.asyncChunkKey,
            asyncModuleName = option.asyncModuleName,
            outputPath = option.outputPath,
            extraStats = option.extraStats,
            _option$runtimeName = option.runtimeName,
            runtimeName = _option$runtimeName === undefined ? 'runtime' : _option$runtimeName,
            _option$isFederation = option.isFederation,
            isFederation = _option$isFederation === undefined ? false : _option$isFederation,
            _option$stats = option.stats,
            stats = _option$stats === undefined ? {} : _option$stats;

        this.isFederation = isFederation;
        this.asyncChunkKey = asyncChunkKey;
        this.asyncModuleName = asyncModuleName;
        this.stats = connectNameGroupsFromChunks(stats);
        this.chunks = chunkName ? Array.isArray(chunkName) ? chunkName : [chunkName] : [];
        // 默认获取 stats 中 entrypoints 的第一个
        this.entrypoints = Array.isArray(entrypoints) ? entrypoints : [entrypoints || Object.keys(stats.entrypoints)[0]];
        this.runtimeName = Array.isArray(runtimeName) ? runtimeName : [runtimeName];
        this.outputPath = outputPath || this.stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssetsByName();
        this.assetsExtra = isFederation && extraStats ? this.getAsstesByExtra(this.stats, extraStats) : [];
        this.assetsLite = this.getAssetsByName(isFederation);
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
        key: 'getAsstesByExtra',
        value: function getAsstesByExtra(stats, extraStats) {
            var chunks = this.chunks;
            var remotesGraph = stats.remotesGraph;
            var currentExposes = extraStats.currentExposes,
                extraChunks = extraStats.chunks,
                extraPath = extraStats.publicPath;
            // 根据 chunks 从 remotesGraph 获取依赖的 federation module

            var deps = chunks.reduce(function (prev, item) {
                var modules = remotesGraph[item];
                return prev.concat(modules.map(function (item) {
                    return item.name;
                }));
            }, []);
            // console.log('=deps=', deps);
            // 根据 deps 获取相应的 chunks
            var depsChunks = (0, _helper.uniq)(deps.reduce(function (prev, item) {
                var curdDep = currentExposes[item];
                // console.log('=curdDep=', curdDep);
                return prev.concat(curdDep);
            }, []));
            // console.log('=depsChunks=', depsChunks);
            // 在 extraStats 中获取 chunk 路径
            var styleAssets = depsChunks.reduce(function (prev, item) {
                var _ref3 = getChunkByName(item, extraChunks) || {},
                    parents = _ref3.parents,
                    curFiles = _ref3.files;

                prev.push.apply(prev, curFiles);
                if (parents && parents.length > 0) {
                    // 从 chunks 获取 parents 的资源文件
                    parents.forEach(function (child) {
                        /*
                         * entry 表示为入口chunk, federation 是 remote 依赖，故 files 为空
                         * 过滤入口 chunk，过滤 federation 的依赖
                         */
                        var _ref4 = getChunkByName(child, chunks) || {},
                            entry = _ref4.entry,
                            files = _ref4.files;

                        if (!entry && files && files.length > 0) {
                            prev.push.apply(prev, files);
                        }
                    });
                }
                return prev;
            }, []).filter(_helper.filterCss).map(function (item) {
                return '' + extraPath + item;
            });
            // console.log('=styleAssets=', styleAssets);
            return styleAssets;
        }
    }, {
        key: 'getAssetsByName',
        value: function getAssetsByName(isFederation) {
            var _this = this;

            var namedChunkGroups = this.stats.namedChunkGroups;

            var tchunks = [].concat(this.entrypoints, isFederation ? [] : this.chunks);

            var tassets = tchunks.reduce(function (prev, item) {
                var assets = namedChunkGroups[item].assets;

                return prev.concat(assets);
            }, []).map(_helper.mapString);
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
                runtimeName = this.runtimeName,
                isFederation = this.isFederation;
            var namedChunkGroups = this.stats.namedChunkGroups;
            // chunks可能是数字，不是字符串，故需要通过 assets 来获取对应的 chunk

            var realEnterpoints = [];
            var realRuntimeName = [];
            entrypoints.forEach(function (item, n) {
                var curchunks = namedChunkGroups[item].chunks;
                // 只保留js，过滤其余的 css 或者 map 等
                var curassets = namedChunkGroups[item].assets.map(_helper.mapString).filter(_helper.filterJs).map(function (item) {
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
            // webpack打包 chunk 依赖有遗漏，把 entrypoints 也传入，chunks不传入
            var tchunks = [].concat(entrypoints, isFederation ? [] : chunks);
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
        key: 'getAsyncModulesStr',
        value: function getAsyncModulesStr() {
            return JSON.stringify(this.chunks);
        }
    }, {
        key: 'getAsyncModules',
        value: function getAsyncModules() {
            return '<script id="' + (0, _reactAsyncmodule.getAsyncModuleName)(this.asyncModuleName) + '" type="application/json">' + this.getAsyncModulesStr() + '</script>';
        }
    }, {
        key: 'getInlineStyles',
        value: function getInlineStyles() {
            var assets = this.assets,
                isFederation = this.isFederation,
                assetsExtra = this.assetsExtra;

            var mainLinks = assets.filter(function (item) {
                return (0, _helper.filterCss)(item.url);
            });
            var cssMap = _resourcemap2.default.getCSSMap();
            if (isFederation) {
                var totalLink = assetsExtra.concat(mainLinks);
                var promises = totalLink.map(function (item) {
                    var isStr = typeof item === 'string';
                    var key = isStr ? item : item.path;
                    if (cssMap && cssMap[key]) {
                        return Promise.resolve({
                            data: cssMap[key],
                            url: isStr ? item : item.url
                        });
                    } else {
                        return new Promise(function (resolve, reject) {
                            if (isStr) {
                                _http2.default.get((0, _helper.getHttpHeader)(item), function (res) {
                                    var rawData = '';
                                    res.on('data', function (chunk) {
                                        rawData += chunk;
                                    });
                                    res.on('end', function () {
                                        try {
                                            _resourcemap2.default.setCSSMap(item, rawData);
                                            resolve({ data: rawData, url: item });
                                        } catch (e) {
                                            reject(e);
                                        }
                                    });
                                }).on('error', function (e) {
                                    reject(e);
                                });
                            } else {
                                _fs2.default.readFile(item.path, 'utf8', function (err, data) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    _resourcemap2.default.setCSSMap(item.path, data);
                                    resolve({ data: data, url: item.url });
                                });
                            }
                        });
                    }
                });
                return Promise.all(promises).then(function (res) {
                    return res.map(function (item) {
                        return (0, _helper.mapStyle)(item.data, item.url);
                    });
                }).then(function (res) {
                    return res.join('');
                });
            }
            if (cssMap) {
                return mainLinks.map(function (item) {
                    return {
                        data: cssMap[item.path],
                        url: item.url
                    };
                }).map(function (item) {
                    return (0, _helper.mapStyle)(item.data, item.url);
                }).join('');
            } else {
                var linksPromises = mainLinks.map(function (item) {
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
                return Promise.all(linksPromises).then(function (res) {
                    return res.map(function (item) {
                        return (0, _helper.mapStyle)(item.data, item.url);
                    });
                }).then(function (res) {
                    return res.join('');
                });
            }
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
            var extraLink = this.assetsExtra.map(_helper.mapLink);
            return extraLink.concat(mainLink).join('');
        }
    }, {
        key: 'getScripts',
        value: function getScripts() {
            var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref5$hasRuntime = _ref5.hasRuntime,
                hasRuntime = _ref5$hasRuntime === undefined ? false : _ref5$hasRuntime;

            var assetsLite = this.assetsLite,
                runtimeName = this.runtimeName,
                isFederation = this.isFederation;

            var mainScript = assetsLite.filter(function (item) {
                return (0, _helper.filterJs)(item.url);
            }).filter(function (item) {
                return hasRuntime ? true : runtimeName.indexOf(item.name) === -1;
            }).map(function (item) {
                return (0, _helper.mapScript)(item.url, true);
            });
            return [isFederation ? this.getAsyncModules() : this.getAsyncChunks()].concat(mainScript).join('');
        }
    }]);

    return Collect;
}();

var create = exports.create = function create(option) {
    return new Collect(option);
};
exports.default = Collect;