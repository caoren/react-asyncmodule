var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import fs from 'fs';
import { filterJs, filterCss, uniq, joinPath } from './helper';

var ResourceMap = function () {
    function ResourceMap() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ResourceMap);

        var outputPath = option.outputPath,
            _option$stats = option.stats,
            stats = _option$stats === undefined ? {} : _option$stats;

        this.stats = stats;
        this.outputPath = outputPath || stats.outputPath;
        // 根据获取对应的 assets
        this.assets = this.getAssets();
    }

    _createClass(ResourceMap, [{
        key: 'getAssets',
        value: function getAssets() {
            var _this = this;

            var namedChunkGroups = this.stats.namedChunkGroups;

            var resources = Object.keys(namedChunkGroups).reduce(function (prev, item) {
                var assets = namedChunkGroups[item].assets;

                return prev.concat(assets);
            }, []);
            return {
                js: uniq(resources.filter(filterJs)).map(function (item) {
                    return joinPath(_this.outputPath, item);
                }),
                css: uniq(resources.filter(filterCss)).map(function (item) {
                    return joinPath(_this.outputPath, item);
                })
            };
        }
    }, {
        key: 'getStyle',
        value: function getStyle() {
            return this.assets.css;
        }
    }, {
        key: 'getScript',
        value: function getScript() {
            return this.assets.js;
        }
    }]);

    return ResourceMap;
}();

var collectMap = function tmpMap() {
    var cssMap = void 0;
    return {
        getCSSMap: function getCSSMap() {
            return cssMap;
        },
        setCSSMap: function setCSSMap(key, data) {
            cssMap = cssMap || {};
            cssMap[key] = data;
        },
        prefetchCss: function prefetchCss(option) {
            var rsMap = new ResourceMap(option);
            var stylesPromises = rsMap.getStyle().map(function (item) {
                return new Promise(function (resolve, reject) {
                    fs.readFile(item, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({ data: data, path: item });
                    });
                });
            });
            return Promise.all(stylesPromises).then(function (res) {
                cssMap = {};
                res.forEach(function (item) {
                    var data = item.data,
                        path = item.path;

                    cssMap[path] = data;
                });
                return cssMap;
            });
        }
    };
}();
export { ResourceMap };
export default collectMap;