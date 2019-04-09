"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _asynccontext = require("./asynccontext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AsyncChunk = function AsyncChunk(_ref) {
    var report = _ref.report,
        receiveData = _ref.receiveData,
        children = _ref.children;

    var providerValue = { report: report, receiveData: receiveData };
    return _react2.default.createElement(
        _asynccontext.AsyncProvider,
        { value: providerValue },
        children
    );
};
exports.default = AsyncChunk;
module.exports = exports["default"];