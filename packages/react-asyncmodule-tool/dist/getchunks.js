'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helper = require('./helper');

var getChunkAssets = function getChunkAssets() {
    var assets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var chunkName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var curAsset = assets[chunkName];
    var entryAsset = assets[_helper.ENTRYKEY];
    var entryJs = entryAsset ? entryAsset.js.map(_helper.mapScript) : [];
    var entryCss = entryAsset ? entryAsset.css.map(_helper.mapLink) : [];
    if (curAsset) {
        var js = curAsset.js,
            css = curAsset.css;
        // entry的js加在最后, entry的css由于优先级关系加在前

        return {
            js: js.map(_helper.mapScript).concat(entryJs).join(''),
            css: entryCss.concat(css.map(_helper.mapLink)).join('')
        };
    }
    return {
        js: entryJs.join(''),
        css: entryCss.join('')
    };
};
exports.default = getChunkAssets;
module.exports = exports['default'];