'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// copy https://github.com/faceyspacey/babel-plugin-dual-import
var LOADED = {};
var getResource = function getResource(rsName) {
    if (typeof window === 'undefined' || !window.__ASSETS_CHUNKS__) {
        return null;
    }
    var CSSChunks = window.__ASSETS_CHUNKS__;
    return CSSChunks[rsName];
};
var ImportCss = function ImportCss(rsName) {
    var href = getResource(rsName);
    if (!href || LOADED[href] === true || typeof window === 'undefined') {
        return Promise.resolve();
    }
    LOADED[href] = true;
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = href;
    link.charset = 'utf-8';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.timeout = 20000;
    return new Promise(function (resolve, reject) {
        var timeout = void 0;
        link.onerror = function () {
            link.onerror = null;
            link.onload = null;
            clearTimeout(timeout);
            var message = 'could not load css: ' + rsName;
            reject(new Error(message));
            delete LOADED[href];
        };
        var img = document.createElement('img');
        img.onerror = function () {
            link.onerror = null;
            img.onerror = null;
            clearTimeout(timeout);
            resolve();
        };
        timeout = setTimeout(link.onerror, link.timeout);
        head.appendChild(link);
        img.src = href;
    });
};
exports.default = ImportCss;
module.exports = exports['default'];