'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _asynccontext = require('./asynccontext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var AsyncChunk = function AsyncChunk(props) {
    var children = props.children,
        providerValue = _objectWithoutProperties(props, ['children']);

    return _react2.default.createElement(
        _asynccontext.AsyncProvider,
        { value: providerValue },
        children
    );
};
exports.default = AsyncChunk;
module.exports = exports['default'];