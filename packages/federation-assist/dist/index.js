"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _attachedfederation = _interopRequireDefault(require("./attachedfederation"));

var _federationruntime = _interopRequireDefault(require("./federationruntime"));

var _lastexportmodule = _interopRequireDefault(require("./lastexportmodule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_attachedfederation["default"].FederationRuntime = _federationruntime["default"];
_attachedfederation["default"].LastExportModulePlugin = _lastexportmodule["default"];
_attachedfederation["default"].setRuntimeUrl = _federationruntime["default"].setRuntimeUrl;
_attachedfederation["default"].getRuntimeUrl = _federationruntime["default"].getRuntimeUrl;
var _default = _attachedfederation["default"];
exports["default"] = _default;
module.exports = exports.default;