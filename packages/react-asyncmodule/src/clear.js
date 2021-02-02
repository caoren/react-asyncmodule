import { AsyncOperate } from './asmod';

const clearWebpackCache = (serverStats = {}) => {
    const { remotesRelatedDepends = [], remotesMap = {} } = serverStats;
    if (__webpack_require__) { // eslint-disable-line
        remotesRelatedDepends.forEach((item) => {
            if (__webpack_require__.mcache[item]) { // eslint-disable-line
                __webpack_require__.mcache[item] = undefined; // eslint-disable-line
            }
        });
        Object.keys(remotesMap).forEach((item) => {
            const curModule = AsyncOperate.get(item);
            if (curModule) {
                __webpack_require__.mcache[curModule.weekId] = undefined; // eslint-disable-line
            }
            __webpack_require__.__installedChunks__[item] = undefined; // eslint-disable-line
        });
        const tempEnternalMap = __webpack_require__.__idToExternalAndNameMapping__ || {}; // eslint-disable-line
        Object.keys(tempEnternalMap).forEach((item) => {
            tempEnternalMap[item].p = undefined;
        });
        AsyncOperate.remove();
    }
};
export default clearWebpackCache;