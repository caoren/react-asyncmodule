import {
    getAsyncChunkKey,
    getAsyncModuleName,
} from './util';
import asyncReady, { chunkReady } from './ready';
import Asyncimport, { AsyncOperate } from './asmod';

export { AsyncOperate };
export { asyncReady };
export { chunkReady };
export { getAsyncChunkKey };
export { getAsyncModuleName };
export default Asyncimport;