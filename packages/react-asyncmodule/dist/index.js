

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getAsyncChunkKey = exports.asyncReady = undefined;

const _util = require('./util');

const _ready = require('./ready');

const _ready2 = _interopRequireDefault(_ready);

const _asmod = require('./asmod');

const _asmod2 = _interopRequireDefault(_asmod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.asyncReady = _ready2.default;
exports.getAsyncChunkKey = _util.getAsyncChunkKey;
exports.default = _asmod2.default;