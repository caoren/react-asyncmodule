'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResourceMap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                js: (0, _helper.uniq)(resources.filter(_helper.filterJs)).map(function (item) {
                    return (0, _helper.joinPath)(_this.outputPath, item);
                }),
                css: (0, _helper.uniq)(resources.filter(_helper.filterCss)).map(function (item) {
                    return (0, _helper.joinPath)(_this.outputPath, item);
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
        prefetchCss: function prefetchCss(option) {
            var rsMap = new ResourceMap(option);
            var stylesPromises = rsMap.getStyle().map(function (item) {
                return new Promise(function (resolve, reject) {
                    _fs2.default.readFile(item, 'utf8', function (err, data) {
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
exports.ResourceMap = ResourceMap;
exports.default = collectMap;