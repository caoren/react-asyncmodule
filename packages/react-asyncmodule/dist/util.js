

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };

// utils
const shallowCopy = exports.shallowCopy = function shallowCopy(target) {
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        return target;
    }
    const newTarget = target;
    const len = arguments.length <= 1 ? 0 : arguments.length - 1;
    if (len <= 0) {
        return newTarget;
    }
    for (let i = 0; i < len; i += 1) {
        const cur = arguments.length <= i + 1 ? undefined : arguments[i + 1];
        if (cur != null) {
            for (const k in cur) {
                // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(cur, k)) {
                    newTarget[k] = cur[k];
                }
            }
        }
    }
    return newTarget;
};
const isServer = exports.isServer = function isServer() {
    return !(typeof window !== 'undefined' && window.document && window.document.createElement);
};
const isWebpack = exports.isWebpack = function isWebpack() {
    return typeof __webpack_require__ !== 'undefined';
}; // eslint-disable-line
const getModule = exports.getModule = function getModule(mod) {
    return mod && (typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object' && mod.__esModule ? mod.default : mod;
}; // eslint-disable-line
const requireById = exports.requireById = function requireById(id) {
    if (isWebpack()) {
        return getModule(__webpack_require__(id)); // eslint-disable-line
    }
    return null;
};
const resolving = exports.resolving = function resolving(load, resolveWeak) {
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