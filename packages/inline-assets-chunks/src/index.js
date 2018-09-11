/* eslint-disable */
import fs from 'fs';
import path from 'path';
import {
    createAssets
} from 'react-asyncmodule-tool';

const INLINECHUNKSNAME = 'window.__ASSETS_CHUNKS__';
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
                type: 'text/javascript',
            },
            innerHTML: `${INLINECHUNKSNAME} = ${assetsStr}`
        };
    }
    getOldScript(assetsStr) {
        return `<script type="text/javascript">${INLINECHUNKSNAME} = ${assetsStr};</script>`;
    }
    exportAssets(assets) {
        const { output } = this.options;
        if (output !== '') {
            const outputDirectory = path.dirname(output);
            try {
                fs.mkdirSync(outputDirectory);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            const assetsStr = JSON.stringify(assets, null, 2);
            fs.writeFileSync(output, assetsStr);
        }
    }
    apply(compiler) {
        // v4
        if (compiler.hooks) {
            compiler.hooks.compilation.tap('AssetsChunksHtmlWebpackPlugin', compilation => {
                let assetsHash;
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
                'html-webpack-plugin-before-html-generation',
                (htmlPluginData, callback) => {
                    assetsHash = createAssets(compilation.chunks, compilation.outputOptions.publicPath);
                    htmlPluginData.assets.assetsHash = assetsHash;
                    callback(null, htmlPluginData);
                });
                const { inject } = this.options;
                compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
                    'html-webpack-plugin-alter-asset-tags',
                (htmlPluginData, callback) => {
                    const cssStr = JSON.stringify(assetsHash.css)
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
            compiler.plugin('compilation', (compilation) => {
                compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
                    const assetsHash = createAssets(compilation.chunks, compilation.outputOptions.publicPath);
                    htmlPluginData.assets.assetsHash = assetsHash;
                    const cssStr = JSON.stringify(assetsHash.css, null, 2);
                    this.exportAssets(assetsHash);
                    const { assets } = htmlPluginData;
                    const { name } = this.options;
                    assets[name] = this.getOldScript(cssStr);
                    callback(null, htmlPluginData);
                });
            });
        }
    }
}
export default InlineAssetsChunks;