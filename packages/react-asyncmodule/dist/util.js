'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// utils
var shallowCopy = exports.shallowCopy = function shallowCopy(target) {
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        return target;
    }
    var newTarget = target;
    var len = arguments.length <= 1 ? 0 : arguments.length - 1;
    if (len <= 0) {
        return newTarget;
    }
    for (var i = 0; i < len; i += 1) {
        var cur = arguments.length <= i + 1 ? undefined : arguments[i + 1];
        if (cur != null) {
            for (var k in cur) {
                // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(cur, k)) {
                    newTarget[k] = cur[k];
                }
            }
        }
    }
    return newTarget;
};
var isServer = exports.isServer = function isServer() {
    return !(typeof window !== 'undefined' && window.document && window.document.createElement);
};
var isWebpack = exports.isWebpack = function isWebpack() {
    return typeof __webpack_require__ !== 'undefined';
}; // eslint-disable-line
var getModule = exports.getModule = function getModule(mod) {
    return mod && (typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object' && mod.__esModule ? mod.default : mod;
}; // eslint-disable-line
var requireById = exports.requireById = function requireById(id) {
    if (isWebpack()) {
        return getModule(__webpack_require__(id)); // eslint-disable-line
    }
    return null;
};
var resolving = exports.resolving = function resolving(load, resolveWeak) {
    if (!resolveWeak) {
        return {
            loaded: false
        };
    }
    var weakId = resolveWeak();
    var isloaded = true;
    // server side `require` is sync
    if (isServer()) {
        load();
    } else {
        // equal to __webpack_require__.m
        isloaded = !!__webpack_modules__[weakId]; // eslint-disable-line
    }
    var com = isloaded ? requireById(weakId) : null;
    if (!com) {
        isloaded = false;
    }
    return {
        loaded: isloaded,
        cur: com
    };
};