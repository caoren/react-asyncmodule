

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _util = require('./util');

const ready = function ready(done) {
    const _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const { asyncChunkKey } = _ref;
    const _ref$chunkInArray = _ref.chunkInArray;
    const chunkInArray = _ref$chunkInArray === undefined ? 'webpackJsonp' : _ref$chunkInArray;

    const scriptElement = document.getElementById((0, _util.getAsyncChunkKey)(asyncChunkKey));
    let asyncChunks = void 0;
    if (scriptElement) {
        asyncChunks = JSON.parse(scriptElement.textContent);
    }
    if (asyncChunks) {
        return new Promise(((resolve) => {
            window[chunkInArray] = window[chunkInArray] || [];
            // loadedChunks 数据格式 [[['chunkName', ..], { key: module, ... }], ..]
            const loadedChunks = window[chunkInArray];
            const originPush = loadedChunks.push;
            const checkReady = function checkReady() {
                const isResolved = asyncChunks.every(item => loadedChunks.some(chunks => chunks[0].indexOf(item) > -1));
                if (isResolved) {
                    loadedChunks.push = originPush;
                    resolve();
                    done();
                }
            };
            loadedChunks.push = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                originPush.apply(originPush, args);
                checkReady();
            };
            checkReady();
        }));
    }
    return Promise.resolve();
};
exports.default = ready;
module.exports = exports.default;