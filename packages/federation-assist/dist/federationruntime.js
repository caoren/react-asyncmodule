"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sourcebase = _interopRequireDefault(require("./sourcebase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var getStrFunc = function getStrFunc() {
  return ["var filename = __webpack_require__.u(chunkId);", "var protocol = __inject_path__.split('://')[0];", "var httpMethod = protocol === 'https' ? require('https') : require('http');", "httpMethod.get(__inject_path__ + filename, function(res) {", "var statusCode = res.statusCode;", "if (statusCode < 200 || statusCode >= 300) {", "reject(new Error('HTTP Error Response: '+ res.status +' '+ res.statusText));", "res.resume();", "return;", "}", "var rawData = '';", "res.on('data', function(chunk) { rawData += chunk; });", "res.on('end', function() {", "try {", "var chunk = {};", "require('vm').runInThisContext('(function(exports, require, __dirname, __filename) {' + rawData + '})', filename)(chunk, require, require('path').dirname(filename), filename);", "installChunk(chunk);", "} catch (e) {", "reject(e);", "}", "})", "}).on('error', function(e) {", "reject(e);", "});"].join("");
};

var currentUrl;

var setRuntimeUrl = function setRuntimeUrl(url) {
  currentUrl = url;
};

var getRuntimeUrl = function getRuntimeUrl() {
  return currentUrl;
};

var customRemoteMethodDefault = function customRemoteMethodDefault(res) {
  return res;
};

var FederationRuntimePlugin = /*#__PURE__*/function (_SourceBase) {
  _inheritsLoose(FederationRuntimePlugin, _SourceBase);

  function FederationRuntimePlugin(option) {
    var _this;

    _this = _SourceBase.call(this, option) || this;
    var newopt = option || {};
    _this.remotes = newopt.remotes || [];
    _this.customRemoteUrl = newopt.customRemoteUrl || customRemoteMethodDefault;
    return _this;
  }

  var _proto = FederationRuntimePlugin.prototype;

  _proto.apply = function apply(compiler) {
    var _this2 = this;

    compiler.hooks.environment.tap('FederationRuntimePlugin', function () {
      _this2.isWeb = compiler.options.target === 'web';
    });

    this._apply(compiler);
  }
  /* 
   * node 端替换 require 请求 remote federation
   * require("http://localhost:7061/livemobile/federation/lookremoteentry.js");
   **/
  ;

  _proto.replaceSource = function replaceSource(source) {
    var remotes = this.remotes,
        customRemoteUrl = this.customRemoteUrl;
    var remotestr;
    var remoteIdx;
    var remoteOrigin;
    var customRemoteStr = customRemoteUrl.toString();
    Object.keys(remotes).forEach(function (item) {
      var remoteUrl = remotes[item]; // emit hooks 已经注入了 eval, 换成 afterCompile 则不存在, production 下只有引号

      var remoteRequire = "require(\"" + remoteUrl + "\")";
      var prodIdx = source.indexOf(remoteRequire);

      if (prodIdx > -1) {
        remotestr = "\n                    function replaceAsyncModule(rawData) {\n                        var cont = rawData;\n                        var idx = -1;\n                        var stringarr = cont.split('\\n');\n                        stringarr.forEach(function(item, n) {\n                            if (item.indexOf('__webpack_require__.u(chunkId)') > -1) {\n                                idx = n;\n                            }\n                        });\n                        if (idx > -1) {\n                            stringarr.splice(idx, 7, \"" + getStrFunc() + "\");\n                            cont = stringarr.join('\\n');\n                        }\n                        return cont;\n                    }\n                    function relaxUrl(url) {\n                        var urlarr = url.split('/');\n                        var filename = urlarr.pop()[0];\n                        var path = urlarr.join('/') + '/';\n                        return { path: path, filename: filename };\n                    }\n                    var getRuntimeUrl = require('asyncmodule-federation-webpack-plugin').getRuntimeUrl;\n                    var currentRuntimeUrl = getRuntimeUrl() || '';\n                    var remoteUrl = (" + customRemoteStr + ")('" + remoteUrl + "', currentRuntimeUrl);\n                    var protocol = remoteUrl.split('://')[0];\n                    var httpMethod = protocol === 'https' ? require('https') : require('http');\n                    module.exports = new Promise(function(resolve, reject) {\n                        httpMethod.get(remoteUrl, (res) => {\n                            var statusCode = res.statusCode;\n                            if (statusCode < 200 || statusCode >= 300) {\n                                reject(new Error('HTTP Error Response: '+ res.status +' '+ res.statusText));\n                                res.resume();\n                                return;\n                            }\n                            var streamData = '';\n                            res.on('data', function(chunk) { streamData += chunk; });\n                            res.on('end', function() {\n                                try {\n                                    var rawData = replaceAsyncModule(streamData);\n                                    var urls = relaxUrl(remoteUrl);\n                                    var chunk = {};\n                                    var filename = 'remotes/' + urls.filename;\n                                    require('vm').runInThisContext('(function(module, require, __dirname, __filename, __inject_path__) {' + rawData + '})', filename)(chunk, require, require('path').dirname(filename), filename, urls.path);\n                                    resolve(chunk.exports);\n                                } catch (e) {\n                                    reject(e);\n                                }\n                            });\n                        }).on('error', function(e) {\n                            reject(e);\n                        });\n                    });\n                ";
        remoteIdx = prodIdx;
        remoteOrigin = remoteRequire;
      }
    });

    if (remoteIdx && remotestr) {
      var remoteFirst = 'module.exports = ';
      return "" + source.slice(0, remoteIdx - remoteFirst.length) + remotestr + source.slice(remoteIdx + remoteOrigin.length + 1);
    }

    return source;
  };

  return FederationRuntimePlugin;
}(_sourcebase["default"]);

FederationRuntimePlugin.setRuntimeUrl = setRuntimeUrl;
FederationRuntimePlugin.getRuntimeUrl = getRuntimeUrl;
var _default = FederationRuntimePlugin;
exports["default"] = _default;
module.exports = exports.default;