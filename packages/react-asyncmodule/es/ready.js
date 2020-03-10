import { getAsyncChunkKey } from './util';

var ready = function ready(done) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        asyncChunkKey = _ref.asyncChunkKey,
        _ref$chunkInArray = _ref.chunkInArray,
        chunkInArray = _ref$chunkInArray === undefined ? 'webpackJsonp' : _ref$chunkInArray;

    var scriptElement = document.getElementById(getAsyncChunkKey(asyncChunkKey));
    var asyncChunks = void 0;
    if (scriptElement) {
        asyncChunks = JSON.parse(scriptElement.textContent);
    }
    if (asyncChunks) {
        return new Promise(function (resolve) {
            window[chunkInArray] = window[chunkInArray] || [];
            // loadedChunks 数据格式 [[['chunkName', ..], { key: module, ... }], ..]
            var loadedChunks = window[chunkInArray];
            var originPush = loadedChunks.push;
            var checkReady = function checkReady() {
                var isResolved = asyncChunks.every(function (item) {
                    return loadedChunks.some(function (chunks) {
                        return chunks[0].indexOf(item) > -1;
                    });
                });
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
        });
    }
    return Promise.resolve();
};
export default ready;