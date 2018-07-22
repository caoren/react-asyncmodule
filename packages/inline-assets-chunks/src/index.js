/* eslint-disable */
var fs = require('fs');
var path = require('path');
// 获取css chunks
function createCssHash (Stats) {
    var {
        assetsByChunkName,
        publicPath
    } = Stats;
    return Object.keys(assetsByChunkName).reduce((hash, name) => {
        var nhash = hash;
        if (!assetsByChunkName[name] || !assetsByChunkName[name].find) return nhash;
        var findCssFile = assetsByChunkName[name].find(file => file.endsWith('.css'));
        if (findCssFile) {
            nhash.css[name] = `${publicPath}${findCssFile}`;
        }
        var findJsFile = assetsByChunkName[name].find(file => file.endsWith('.js'));
        if (findJsFile) {
            nhash.js[name] = `${publicPath}${findJsFile}`;
        } 
        return nhash;
    }, { js: {}, css: {}});
};
function InlineCSSChunks (options) {
    options = options || {};
    this.globalName = options.globalName || 'ASSETS_CHUNKS';
    this.name = options.name || 'webpackAssetsChunks';
    this.outputJson = options.outputJson || '';
}
InlineCSSChunks.prototype.apply = function (compiler) {
    var self = this;
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
            var assets = htmlPluginData.assets;
            var name = self.name;
            var CssChunks = [];
            var cssHashs = createCssHash(compilation.getStats().toJson());
            if (cssHashs) {
                var assetsStr = JSON.stringify(cssHashs, null, 2);
                CssChunks.push('<script type="text/javascript">');
                CssChunks.push('window.'+ self.globalName +'='+ assetsStr);
                CssChunks.push('</script>');
                assets[name] = CssChunks.join('');
                var outputJson = self.outputJson;
                if (outputJson !== '') {
                    const outputDirectory = path.dirname(outputJson);
                    try {
                        fs.mkdirSync(outputDirectory);
                    } catch (err) {
                        if (err.code !== 'EEXIST') {
                            throw err;
                        }
                    }
                    fs.writeFileSync(outputJson, assetsStr);
                }
            }
            callback(null, htmlPluginData);
        })
    });
}
module.exports = InlineCSSChunks;