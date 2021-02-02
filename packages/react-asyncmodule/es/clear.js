import { AsyncOperate } from './asmod';

var clearWebpackCache = function clearWebpackCache() {
    var serverStats = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _serverStats$remotesR = serverStats.remotesRelatedDepends,
        remotesRelatedDepends = _serverStats$remotesR === undefined ? [] : _serverStats$remotesR,
        _serverStats$remotesM = serverStats.remotesMap,
        remotesMap = _serverStats$remotesM === undefined ? {} : _serverStats$remotesM;

    if (__webpack_require__) {
        // eslint-disable-line
        remotesRelatedDepends.forEach(function (item) {
            if (__webpack_require__.mcache[item]) {
                // eslint-disable-line
                __webpack_require__.mcache[item] = undefined; // eslint-disable-line
            }
        });
        Object.keys(remotesMap).forEach(function (item) {
            var curModule = AsyncOperate.get(item);
            if (curModule) {
                __webpack_require__.mcache[curModule.weekId] = undefined; // eslint-disable-line
            }
            __webpack_require__.__installedChunks__[item] = undefined; // eslint-disable-line
        });
        var tempEnternalMap = __webpack_require__.__idToExternalAndNameMapping__ || {}; // eslint-disable-line
        Object.keys(tempEnternalMap).forEach(function (item) {
            tempEnternalMap[item].p = undefined;
        });
        AsyncOperate.remove();
    }
};
export default clearWebpackCache;