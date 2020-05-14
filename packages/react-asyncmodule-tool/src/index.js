import Collect, { create } from './collect';
import collectMap, { ResourceMap } from './resourcemap';
import createAssets from './createassets';
import getChunkAssets from './getchunks';

export { collectMap };
export { ResourceMap };
export { createAssets };
export { getChunkAssets };
export const createCollect = create;
export default Collect;