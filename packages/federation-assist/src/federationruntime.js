import SourceBase from './sourcebase';

const getStrFunc = () => {
    return [
        "var filename = __webpack_require__.u(chunkId);",
        "var protocol = __inject_path__.split('://')[0];",
        "var httpMethod = protocol === 'https' ? require('https') : require('http');",
        "httpMethod.get(__inject_path__ + filename, function(res) {",
            "var statusCode = res.statusCode;",
            "if (statusCode < 200 || statusCode >= 300) {",
                "reject(new Error('HTTP Error Response: '+ res.status +' '+ res.statusText));",
                "res.resume();",
                "return;",
            "}",
            "var rawData = '';",
            "res.on('data', function(chunk) { rawData += chunk; });",
            "res.on('end', function() {",
                "try {",
                    "var chunk = {};",
                    "require('vm').runInThisContext('(function(exports, require, __dirname, __filename) {' + rawData + '})', filename)(chunk, require, require('path').dirname(filename), filename);",
                    "installChunk(chunk);",
                "} catch (e) {",
                    "reject(e);",
                "}",
            "}).on('error', function(e) {",
                "reject(e);",
            "});",
        "});"
    ].join("");
}

let currentUrl;
const setRuntimeUrl = (url) => {
    currentUrl = url;
}
const getRuntimeUrl = () => currentUrl;

const customRemoteMethodDefault = res => res;
class FederationRuntimePlugin extends SourceBase {
    constructor(option) {
        super(option);
        const newopt = option || {};
        this.remotes = newopt.remotes || [];
        this.customRemoteUrl = newopt.customRemoteUrl || customRemoteMethodDefault;
    }

    apply(compiler) {
        compiler.hooks.environment.tap('FederationRuntimePlugin', () => {
            this.isWeb = compiler.options.target === 'web';
        });
        this._apply(compiler);
    }

    /* 
     * node 端替换 require 请求 remote federation
     * require("http://localhost:7061/livemobile/federation/lookremoteentry.js");
     **/
    replaceSource(source) {
        const { remotes, customRemoteUrl } = this;
        let remotestr;
        let remoteIdx;
        let remoteOrigin;
        const customRemoteStr = customRemoteUrl.toString();
        Object.keys(remotes).forEach((item) => {
            const remoteUrl = remotes[item];
            // emit hooks 已经注入了 eval, 换成 afterCompile 则不存在, production 下只有引号
            const remoteRequire = `require("${remoteUrl}")`;
            const prodIdx = source.indexOf(remoteRequire);
            if (prodIdx > -1) {
                remotestr = `
                    function replaceAsyncModule(rawData) {
                        var cont = rawData;
                        var idx = -1;
                        var stringarr = cont.split('\\n');
                        stringarr.forEach(function(item, n) {
                            if (item.indexOf('__webpack_require__.u(chunkId)') > -1) {
                                idx = n;
                            }
                        });
                        if (idx > -1) {
                            stringarr.splice(idx, 7, "${getStrFunc()}");
                            cont = stringarr.join('\\n');
                        }
                        return cont;
                    }
                    function relaxUrl(url) {
                        var urlarr = url.split('/');
                        var filename = urlarr.pop()[0];
                        var path = urlarr.join('/') + '/';
                        return { path: path, filename: filename };
                    }
                    var getRuntimeUrl = require('asyncmodule-federation-webpack-plugin').getRuntimeUrl;
                    var currentRuntimeUrl = getRuntimeUrl() || '';
                    var remoteUrl = (${customRemoteStr})('${remoteUrl}', currentRuntimeUrl);
                    var protocol = remoteUrl.split('://')[0];
                    var httpMethod = protocol === 'https' ? require('https') : require('http');
                    module.exports = new Promise(function(resolve, reject) {
                        httpMethod.get(remoteUrl, (res) => {
                            var statusCode = res.statusCode;
                            if (statusCode < 200 || statusCode >= 300) {
                                reject(new Error('HTTP Error Response: '+ res.status +' '+ res.statusText));
                                res.resume();
                                return;
                            }
                            var streamData = '';
                            res.on('data', function(chunk) { streamData += chunk; });
                            res.on('end', function() {
                                try {
                                    var rawData = replaceAsyncModule(streamData);
                                    var urls = relaxUrl(remoteUrl);
                                    var chunk = {};
                                    var filename = 'remotes/' + urls.filename;
                                    require('vm').runInThisContext('(function(module, require, __dirname, __filename, __inject_path__) {' + rawData + '})', filename)(chunk, require, require('path').dirname(filename), filename, urls.path);
                                    resolve(chunk.exports);
                                } catch (e) {
                                    reject(e);
                                }
                            });
                        }).on('error', function(e) {
                            reject(e);
                        });
                    });
                `;
                remoteIdx = prodIdx;
                remoteOrigin = remoteRequire;
            }
        });
        if (remoteIdx && remotestr) {
            const remoteFirst = 'module.exports = ';
            return `${source.slice(0, remoteIdx - remoteFirst.length)}${remotestr}${source.slice(remoteIdx + remoteOrigin.length + 1)}`;
        }
        return source;
    }
}
FederationRuntimePlugin.setRuntimeUrl = setRuntimeUrl;
FederationRuntimePlugin.getRuntimeUrl = getRuntimeUrl;
export default FederationRuntimePlugin;
