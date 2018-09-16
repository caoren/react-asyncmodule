'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var filterEmpty = function filterEmpty(item) {
    return !!item;
};
var getChunksByMatch = function getChunksByMatch() {
    var matchRoute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var components = matchRoute.map(function (item) {
        return item.route.component;
    }).filter(filterEmpty);
    var chunkNames = components.map(function (item) {
        var chunk = item.chunk;

        if (typeof chunk === 'function') {
            return chunk.call(item);
        } else {
            return '';
        }
    }).filter(function (item) {
        return item !== '';
    });
    var comps = components.map(function (item) {
        return item.comp;
    }).filter(filterEmpty);
    return { chunkNames: chunkNames, comps: comps };
};
exports.default = getChunksByMatch;
module.exports = exports['default'];