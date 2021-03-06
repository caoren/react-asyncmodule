'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCollect = exports.getChunkAssets = exports.createAssets = undefined;

var _collect = require('./collect');

var _collect2 = _interopRequireDefault(_collect);

var _createassets = require('./createassets');

var _createassets2 = _interopRequireDefault(_createassets);

var _getchunks = require('./getchunks');

var _getchunks2 = _interopRequireDefault(_getchunks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createAssets = _createassets2.default;
exports.getChunkAssets = _getchunks2.default;
var createCollect = exports.createCollect = _collect.create;
exports.default = _collect2.default;