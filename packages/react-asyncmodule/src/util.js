// utils
export const ASYNC_MODULE_CHUNKS = '__ASYNC_MODULE_CHUNKS__';
export const getAsyncChunkKey = (key) => key || ASYNC_MODULE_CHUNKS;

export const shallowCopy = (target, ...args) => {
    if (typeof target !== 'object') {
        return target;
    }
    const newTarget = target;
    const len = args.length;
    if (len <= 0) {
        return newTarget;
    }
    for (let i = 0; i < len; i += 1) {
        const cur = args[i];
        if (cur != null) {
            for (let k in cur) { // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(cur, k)) {
                    newTarget[k] = cur[k];
                }
            }
        }
    }
    return newTarget;
};
let testServer = false;
// only use test
export const setTestServer = (bool) => {
    testServer = bool;
};
export const isServer = () => testServer || !(
    typeof window !== 'undefined'
    && window.document
    && window.document.createElement
);
export const isWebpack = () => typeof __webpack_require__ !== 'undefined'; // eslint-disable-line
export const getModule = mod => mod && typeof mod === 'object' && mod.__esModule ? mod.default : mod;  // eslint-disable-line
export const requireById = (id) => {
    if (isWebpack()) {
        return getModule(__webpack_require__(id)); // eslint-disable-line
    }
    return null;
};
// sync fetch corresponding component
// webpack if module exist, must find `__webpack_modules__`
export const syncModule = (resolveWeak, load) => {
    if (!resolveWeak) {
        return null;
    }
    const weakId = resolveWeak();
    // `__webpack_modules__` equal to `__webpack_require__.m`
    if (__webpack_modules__[weakId]) { // eslint-disable-line
        return requireById(weakId);
    } else if (load && isServer()) {
        load();
        return requireById(weakId);
    }
    return null;
};