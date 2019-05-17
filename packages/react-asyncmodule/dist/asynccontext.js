'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.withConsumer = exports.AsyncProvider = exports.AsyncConsumer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactContext = require('create-react-context');

var _createReactContext2 = _interopRequireDefault(_createReactContext);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AsyncContext = (0, _createReactContext2.default)({});
var AsyncConsumer = exports.AsyncConsumer = AsyncContext.Consumer;
var AsyncProvider = exports.AsyncProvider = AsyncContext.Provider;
var withConsumer = exports.withConsumer = function withConsumer(Component) {
    var consumer = function consumer(props) {
        return _react2.default.createElement(
            AsyncConsumer,
            null,
            function (asyncProp) {
                return _react2.default.createElement(Component, _extends({}, props, asyncProp));
            }
        );
    };
    (0, _hoistNonReactStatics2.default)(consumer, Component);
    return consumer;
};
exports.default = AsyncContext;