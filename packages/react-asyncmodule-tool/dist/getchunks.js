'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getChunksByMatch = function getChunksByMatch() {
    var matchRoute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return matchRoute.map(function (item) {
        return item.route.component;
    }).filter(function (item) {
        return !!item;
    }).map(function (item) {
        var chunk = item.chunk;

        if (typeof chunk === 'function') {
            return chunk.call(item);
        } else {
            return '';
        }
    }).filter(function (item) {
        return item !== '';
    });
};
exports.default = getChunksByMatch;
module.exports = exports['default'];