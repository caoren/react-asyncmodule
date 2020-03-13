'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAsyncChunkKey = exports.asyncReady = undefined;

var _util = require('./util');

var _ready = require('./ready');

var _ready2 = _interopRequireDefault(_ready);

var _asmod = require('./asmod');

var _asmod2 = _interopRequireDefault(_asmod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.asyncReady = _ready2.default;
exports.getAsyncChunkKey = _util.getAsyncChunkKey;
exports.default = _asmod2.default;