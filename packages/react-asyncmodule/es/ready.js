import { AsyncOperate } from './index';
import { getAsyncChunkKey, getAsyncModuleName } from './util';

export var chunkReady = function chunkReady(done) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        asyncModuleName = _ref.asyncModuleName;

    var scriptElement = document.getElementById(getAsyncModuleName(asyncModuleName));
    var asyncModules = void 0;
    if (scriptElement) {
        asyncModules = JSON.parse(scriptElement.textContent);
    }
    if (asyncModules) {
        return Promise.all(asyncModules.map(function (item) {
            var curModule = AsyncOperate.get(item);
            var promise = curModule ? curModule.preload() : Promise.resolve();
            return promise;
        })).then(done);
    }
    return Promise.resolve();
};

var ready = function ready(done) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        asyncChunkKey = _ref2.asyncChunkKey,
        _ref2$chunkInArray = _ref2.chunkInArray,
        chunkInArray = _ref2$chunkInArray === undefined ? 'webpackJsonp' : _ref2$chunkInArray;

    var scriptElement = document.getElementById(getAsyncChunkKey(asyncChunkKey));
    var asyncChunks = void 0;
    if (scriptElement) {
        asyncChunks = JSON.parse(scriptElement.textContent);
    }
    var isDone = false;
    if (asyncChunks) {
        return new Promise(function (resolve) {
            window[chunkInArray] = window[chunkInArray] || [];
            // loadedChunks 数据格式 [[['chunkName', ..], { key: module, ... }], ..]
            var loadedChunks = window[chunkInArray];
            var originPush = loadedChunks.push;
            var checkReady = function checkReady() {
                if (isDone) {
                    return;
                }
                var hasChunk = function hasChunk(item) {
                    return function (chunks) {
                        return chunks[0].indexOf(item) > -1;
                    };
                };
                var dealLoadChunks = function dealLoadChunks(item) {
                    return loadedChunks.some(hasChunk(item));
                };
                var isResolved = asyncChunks.every(dealLoadChunks);
                if (isResolved) {
                    isDone = true;
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