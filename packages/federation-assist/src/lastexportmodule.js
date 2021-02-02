import SourceBase from './sourcebase';

const CKRPSTR = 'var installedChunks = {';
const IDRPSTR = 'var idToExternalAndNameMapping = {';
const CARPSTR = 'var __webpack_module_cache__ = {};';

class LastExportModulePlugin extends SourceBase {
    constructor(option) {
        super(option);
    }

    apply(compiler) {
        this._apply(compiler);
    }

    /* 
     * __webpack_module_cache__
     * installedChunks
     * idToExternalAndNameMapping
     * 针对上诉 3 种，挂在到 __webpack_require__ 下
     **/
    replaceSource(source) {
        const ckIdx = source.indexOf(CKRPSTR);
        const idIdx =source.indexOf(IDRPSTR);
        const caIdx = source.indexOf(CARPSTR);
        let idx;
        let replacestr;
        let originstr;
        if (ckIdx > -1) {
            idx = ckIdx;
            replacestr = 'var installedChunks = __webpack_require__.__installedChunks__ = {';
            originstr = CKRPSTR;
        } else if (idIdx > -1) {
            idx = idIdx;
            replacestr = 'var idToExternalAndNameMapping = __webpack_require__.__idToExternalAndNameMapping__ = {';
            originstr = IDRPSTR;
        } else if (caIdx > -1) {
            idx = caIdx;
            replacestr = 'var __webpack_module_cache__ = __webpack_require__.mcache = {};';
            originstr = CARPSTR;
        }
        if (idx && replacestr) {
            return `${source.slice(0, idx)}${replacestr}${source.slice(idx + originstr.length)}`;
        }
        return source;
    }
}
export default LastExportModulePlugin;
