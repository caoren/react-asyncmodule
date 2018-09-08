'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable */


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INLINECHUNKSNAME = 'window.__ASSETS_CHUNKS__';
var defaultOptions = {
    name: 'webpackInlineAssetsChunks',
    inject: 'body',
    output: ''
};

var InlineAssetsChunks = function () {
    function InlineAssetsChunks() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, InlineAssetsChunks);

        this.options = Object.assign({}, defaultOptions, options);
    }

    _createClass(InlineAssetsChunks, [{
        key: 'getScriptTag',
        value: function getScriptTag(assetsStr) {
            return {
                tagName: 'script',
                closeTag: true,
                attributes: {
                    type: 'text/javascript'
                },
                innerHTML: INLINECHUNKSNAME + ' = ' + assetsStr
            };
        }
    }, {
        key: 'getOldScript',
        value: function getOldScript(assetsStr) {
            return '<script type="text/javascript">' + INLINECHUNKSNAME + ' = ' + assetsStr + ';</script>';
        }
    }, {
        key: 'exportAssets',
        value: function exportAssets(assets) {
            var output = this.options.output;

            if (output !== '') {
                var outputDirectory = _path2.default.dirname(output);
                try {
                    _fs2.default.mkdirSync(outputDirectory);
                } catch (err) {
                    if (err.code !== 'EEXIST') {
                        throw err;
                    }
                }
                var assetsStr = JSON.stringify(assets, null, 2);
                _fs2.default.writeFileSync(output, assetsStr);
            }
        }
    }, {
        key: 'apply',
        value: function apply(compiler) {
            var _this = this;

            // v4
            if (compiler.hooks) {
                compiler.hooks.compilation.tap('AssetsChunksHtmlWebpackPlugin', function (compilation) {
                    var assetsHash = void 0;
                    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
                        assetsHash = (0, _util.createAssetsHash)(compilation.chunks, compilation.outputOptions.publicPath);
                        htmlPluginData.assets.assetsHash = assetsHash;
                        callback(null, htmlPluginData);
                    });
                    var inject = _this.options.inject;

                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
                        var cssStr = JSON.stringify(assetsHash.css);
                        var tag = _this.getScriptTag(cssStr);
                        if (inject === 'head') {
                            htmlPluginData.head.push(tag);
                        } else {
                            htmlPluginData.body.unshift(tag);
                        }
                        _this.exportAssets(assetsHash);
                        callback(null, htmlPluginData);
                    });
                });
            } else {
                compiler.plugin('compilation', function (compilation) {
                    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
                        var assetsHash = (0, _util.createAssetsHash)(compilation.chunks, compilation.outputOptions.publicPath);
                        htmlPluginData.assets.assetsHash = assetsHash;
                        var cssStr = JSON.stringify(assetsHash.css, null, 2);
                        _this.exportAssets(assetsHash);
                        var assets = htmlPluginData.assets;
                        var name = _this.options.name;

                        assets[name] = _this.getOldScript(cssStr);
                        callback(null, htmlPluginData);
                    });
                });
            }
        }
    }]);

    return InlineAssetsChunks;
}();

exports.default = InlineAssetsChunks;
module.exports = exports['default'];