import { AsyncOperate } from './index';
import {
    getAsyncChunkKey,
    getAsyncModuleName
} from './util';

export const chunkReady = (done, {
    asyncModuleName
} = {}) => {
    const scriptElement = document.getElementById(getAsyncModuleName(asyncModuleName));
    let asyncModules;
    if (scriptElement) {
        asyncModules = JSON.parse(scriptElement.textContent);
    }
    if (asyncModules) {
        return Promise.all(asyncModules.map((item) => {
            const curModule = AsyncOperate.get(item);
            const promise = curModule ? curModule.preload() : Promise.resolve();
            return promise;
        })).then(done);
    }
    return Promise.resolve();
};

const ready = (done, {
    asyncChunkKey,
    chunkInArray = 'webpackJsonp'
} = {}) => {
    const scriptElement = document.getElementById(getAsyncChunkKey(asyncChunkKey));
    let asyncChunks;
    if (scriptElement) {
        asyncChunks = JSON.parse(scriptElement.textContent);
    }
    let isDone = false;
    if (asyncChunks) {
        return new Promise((resolve) => {
            window[chunkInArray] = window[chunkInArray] || [];
            // loadedChunks 数据格式 [[['chunkName', ..], { key: module, ... }], ..]
            const loadedChunks = window[chunkInArray];
            const originPush = loadedChunks.push;
            const checkReady = () => {
                if (isDone) {
                    return;
                }
                const hasChunk = item => chunks => chunks[0].indexOf(item) > -1;
                const dealLoadChunks = item => loadedChunks.some(hasChunk(item));
                const isResolved = asyncChunks.every(dealLoadChunks);
                if (isResolved) {
                    isDone = true;
                    resolve();
                    done();
                }
            };
            loadedChunks.push = (...args) => {
                originPush.apply(originPush, args);
                checkReady();
            };
            checkReady();
        });
    }
    return Promise.resolve();
};
export default ready;