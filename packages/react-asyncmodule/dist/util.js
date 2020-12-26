'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// utils
var ASYNC_MODULE_CHUNKS = exports.ASYNC_MODULE_CHUNKS = '__ASYNC_MODULE_CHUNKS__';
var getAsyncChunkKey = exports.getAsyncChunkKey = function getAsyncChunkKey(key) {
    return key || ASYNC_MODULE_CHUNKS;
};
var ASYNC_MODULE_NAMES = exports.ASYNC_MODULE_NAMES = '__ASYNC_MODULE_NAMES__';
var getAsyncModuleName = exports.getAsyncModuleName = function getAsyncModuleName(name) {
    return name || ASYNC_MODULE_NAMES;
};

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
var testServer = false;
// only use test
var setTestServer = exports.setTestServer = function setTestServer(bool) {
    testServer = bool;
};
var isServer = exports.isServer = function isServer() {
    return testServer || !(typeof window !== 'undefined' && window.document && window.document.createElement);
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
// sync fetch corresponding component
// webpack if module exist, must find `__webpack_modules__`
var syncModule = exports.syncModule = function syncModule(resolveWeak, load) {
    if (!resolveWeak) {
        return null;
    }
    var weakId = resolveWeak();
    // `__webpack_modules__` equal to `__webpack_require__.m`
    if (__webpack_modules__[weakId]) {
        // eslint-disable-line
        return requireById(weakId);
    } else if (load && isServer()) {
        load();
        return requireById(weakId);
    }
    return null;
};