import {
    getAsyncChunkKey
} from './util';

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
                const isResolved = asyncChunks.every(item => loadedChunks.some(chunks => chunks[0].indexOf(item) > -1));
                if (isResolved) {
                    isDone = true;
                    resolve();
                    done();
                }
            }
            loadedChunks.push = (...args) => {
                originPush.apply(originPush, args);
                checkReady();
            }
            checkReady();
        });
    }
    return Promise.resolve();
}
export default ready;
