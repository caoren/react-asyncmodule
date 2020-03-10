

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _asynccontext = require('./asynccontext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { const target = {}; for (const i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const AsyncChunk = function AsyncChunk(props) {
    const { children } = props;
    const providerValue = _objectWithoutProperties(props, ['children']);

    return _react2.default.createElement(
        _asynccontext.AsyncProvider,
        { value: providerValue },
        children
    );
};
exports.default = AsyncChunk;
module.exports = exports.default;