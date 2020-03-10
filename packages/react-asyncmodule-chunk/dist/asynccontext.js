

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.AsyncProvider = undefined;

const _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _createReactContext = require('create-react-context');

const _createReactContext2 = _interopRequireDefault(_createReactContext);

const _hoistNonReactStatics = require('hoist-non-react-statics');

const _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AsyncContext = (0, _createReactContext2.default)({});
const AsyncProvider = AsyncContext.Provider;
const AsyncConsumer = AsyncContext.Consumer;
const withConsumer = function withConsumer(Component) {
    const consumer = function consumer(props) {
        return _react2.default.createElement(
            AsyncConsumer,
            null,
            asyncProp => _react2.default.createElement(Component, _extends({}, props, asyncProp))
        );
    };
    (0, _hoistNonReactStatics2.default)(consumer, Component);
    return consumer;
};
exports.AsyncProvider = AsyncProvider;
exports.default = withConsumer;