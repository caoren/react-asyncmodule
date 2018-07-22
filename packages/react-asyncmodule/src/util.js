// utils
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
export const isServer = () => !(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);
export const isWebpack = () => typeof __webpack_require__ !== 'undefined'; // eslint-disable-line
export const getModule = mod => mod && typeof mod === 'object' && mod.__esModule ? mod.default : mod;  // eslint-disable-line
export const requireById = (id) => {
    if (isWebpack()) {
        return getModule(__webpack_require__(id)); // eslint-disable-line
    }
    return null;
};
export const resolving = (load, resolveWeak) => {
    if (!resolveWeak) {
        return {
            loaded: false
        };
    }
    const weakId = resolveWeak();
    let isloaded = true;
    // server side `require` is sync
    if (isServer()) {
        load();
    } else {
        // equal to __webpack_require__.m
        isloaded = !!__webpack_modules__[weakId]; // eslint-disable-line
    }
    const com = isloaded ? requireById(weakId) : null;
    if (!com) {
        isloaded = false;
    }
    return {
        loaded: isloaded,
        cur: com
    };
};