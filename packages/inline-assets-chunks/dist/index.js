'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactAsyncmoduleTool = require('react-asyncmodule-tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const INLINECHUNKSNAME = 'window.__ASSETS_CHUNKS__'; /* eslint-disable */

const defaultOptions = {
    name: 'webpackInlineAssetsChunks',
    inject: 'body',
    output: ''
};
class InlineAssetsChunks {
    constructor(options = {}) {
        this.options = Object.assign({}, defaultOptions, options);
    }
    getScriptTag(assetsStr) {
        return {
            tagName: 'script',
            closeTag: true,
            attributes: {
                type: 'text/javascript'
            },
            innerHTML: `${INLINECHUNKSNAME} = ${assetsStr}`
        };
    }
    getOldScript(assetsStr) {
        return `<script type="text/javascript">${INLINECHUNKSNAME} = ${assetsStr};</script>`;
    }
    exportAssets(assets) {
        const output = this.options.output;

        if (output !== '') {
            const outputDirectory = _path2.default.dirname(output);
            try {
                _fs2.default.mkdirSync(outputDirectory);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            const assetsStr = JSON.stringify(assets, null, 2);
            _fs2.default.writeFileSync(output, assetsStr);
        }
    }
    apply(compiler) {
        // v4
        if (compiler.hooks) {
            compiler.hooks.compilation.tap('AssetsChunksHtmlWebpackPlugin', compilation => {
                let assetsHash;
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
                    assetsHash = (0, _reactAsyncmoduleTool.createAssets)(compilation.chunks, compilation.outputOptions.publicPath);
                    htmlPluginData.assets.assetsHash = assetsHash;
                    callback(null, htmlPluginData);
                });
                const inject = this.options.inject;

                compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {
                    const cssStr = JSON.stringify(assetsHash.css);
                    const tag = this.getScriptTag(cssStr);
                    if (inject === 'head') {
                        htmlPluginData.head.push(tag);
                    } else {
                        htmlPluginData.body.unshift(tag);
                    }
                    this.exportAssets(assetsHash);
                    callback(null, htmlPluginData);
                });
            });
        } else {
            compiler.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
                    const assetsHash = (0, _reactAsyncmoduleTool.createAssets)(compilation.chunks, compilation.outputOptions.publicPath);
                    htmlPluginData.assets.assetsHash = assetsHash;
                    const cssStr = JSON.stringify(assetsHash.css, null, 2);
                    this.exportAssets(assetsHash);
                    const assets = htmlPluginData.assets;
                    const name = this.options.name;

                    assets[name] = this.getOldScript(cssStr);
                    callback(null, htmlPluginData);
                });
            });
        }
    }
}
exports.default = InlineAssetsChunks;
module.exports = exports['default'];