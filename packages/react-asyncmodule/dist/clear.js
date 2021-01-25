'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asmod = require('./asmod');

var clearWebpackCache = function clearWebpackCache() {
    var clientStats = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _clientStats$remotesR = clientStats.remotesRelatedDepends,
        remotesRelatedDepends = _clientStats$remotesR === undefined ? [] : _clientStats$remotesR,
        _clientStats$remotesM = clientStats.remotesMap,
        remotesMap = _clientStats$remotesM === undefined ? {} : _clientStats$remotesM;

    if (__webpack_require__) {
        // eslint-disable-line
        remotesRelatedDepends.forEach(function (item) {
            if (__webpack_require__.mcache[item]) {
                // eslint-disable-line
                __webpack_require__.mcache[item] = undefined; // eslint-disable-line
            }
        });
        Object.keys(remotesMap).forEach(function (item) {
            var curModule = _asmod.AsyncOperate.get(item);
            if (curModule) {
                __webpack_require__.mcache[curModule.weekId] = undefined; // eslint-disable-line
            }
            __webpack_require__.__installedChunks__[item] = undefined; // eslint-disable-line
        });
        var tempEnternalMap = __webpack_require__.__idToExternalAndNameMapping__ || {}; // eslint-disable-line
        Object.keys(tempEnternalMap).forEach(function (item) {
            tempEnternalMap[item].p = undefined;
        });
        _asmod.AsyncOperate.remove();
    }
};
exports.default = clearWebpackCache;
module.exports = exports['default'];