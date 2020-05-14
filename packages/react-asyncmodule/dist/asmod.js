'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _reactAsyncmoduleChunk = require('react-asyncmodule-chunk');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TIMEOUT = 120000;
var DELAY = 200;
var packComponent = function packComponent(comp) {
    return function (props) {
        if (!comp) {
            return null;
        }
        // class function
        if (_react2.default.isValidElement(comp)) {
            return _react2.default.cloneElement(comp, props);
        }
        return _react2.default.createElement(comp, props);
    };
};
var customData = function customData() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var chunkName = arguments[1];
    return data[chunkName];
};

/*
 * options
 * @load `function` return a `Promise` instance
 * @render `function` custom render
 * @resolveWeak `function` return webpack moduleid
 * @loading `React Element`
 * @error `React Element`
 * @delay `number` ms, loading view delay display
 * @timeout `number` ms, load timeout time
 */
var DEFAULTOPTIONS = {
    load: null,
    render: null,
    resolveWeak: null,
    loading: null,
    error: null,
    delay: DELAY,
    timeout: TIMEOUT,
    onModuleLoaded: null
};
var Dueimport = function Dueimport() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var load = option.load,
        _render = option.render,
        loading = option.loading,
        error = option.error,
        delay = option.delay,
        timeout = option.timeout,
        resolveWeak = option.resolveWeak,
        chunk = option.chunk,
        onModuleLoaded = option.onModuleLoaded;

    if (!load) {
        return null;
    }
    var isHasRender = typeof _render === 'function';
    var chunkName = typeof chunk === 'function' ? chunk() : '';
    // The first letter of the react component
    // name is uppercase
    var LoadingView = packComponent(loading);
    var ErrorView = packComponent(error);
    var isDelay = typeof delay === 'number' && delay !== 0;
    var isTimeout = typeof timeout === 'number' && timeout !== 0;

    var AsyncComponent = function (_Component) {
        _inherits(AsyncComponent, _Component);

        _createClass(AsyncComponent, null, [{
            key: 'preload',
            value: function preload() {
                var comp = (0, _util.syncModule)(resolveWeak);
                return Promise.resolve().then(function () {
                    if (comp) {
                        return comp;
                    }
                    return load();
                });
            }
        }, {
            key: 'preloadWeak',
            value: function preloadWeak() {
                return (0, _util.syncModule)(resolveWeak);
            }
        }]);

        function AsyncComponent(props) {
            _classCallCheck(this, AsyncComponent);

            var _this = _possibleConstructorReturn(this, (AsyncComponent.__proto__ || Object.getPrototypeOf(AsyncComponent)).call(this, props));

            _this.unmount = false;

            var report = props.report,
                otherProps = _objectWithoutProperties(props, ['report']);

            var comp = (0, _util.syncModule)(resolveWeak, load);
            if (report && comp) {
                var exportStatic = {};
                (0, _hoistNonReactStatics2.default)(exportStatic, comp);
                exportStatic.chunkName = chunkName;
                exportStatic.__transmitProps__ = otherProps; // eslint-disable-line
                report(exportStatic);
            }
            _this.state = {
                comp: comp,
                err: '',
                request: !isDelay
            };
            _this.retry = _this.retry.bind(_this);
            _this.changeState = _this.changeState.bind(_this);
            _this.loadedCb = _this.loadedCb.bind(_this);
            if (!comp) {
                _this.loadComp();
            } else {
                _this.loadedCb(comp, (0, _util.isServer)());
            }
            return _this;
        }

        _createClass(AsyncComponent, [{
            key: 'loadedCb',
            value: function loadedCb(comp, inServer) {
                if (onModuleLoaded) {
                    onModuleLoaded({
                        chunkName: chunkName,
                        props: this.props,
                        isServer: inServer,
                        component: comp,
                        setState: this.changeState
                    });
                }
            }
        }, {
            key: 'changeState',
            value: function changeState() {
                var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                if (this.unmount) {
                    return false;
                }
                return this.setState(state);
            }
        }, {
            key: 'retry',
            value: function retry() {
                this.loadComp();
            }
        }, {
            key: 'clearTime',
            value: function clearTime() {
                if (this.delayTime) {
                    clearTimeout(this.delayTime);
                    delete this.delayTime;
                }
                if (this.timeoutTime) {
                    clearTimeout(this.timeoutTime);
                    delete this.timeoutTime;
                }
            }
        }, {
            key: 'loadComp',
            value: function loadComp() {
                var _this2 = this;

                if (isDelay) {
                    this.delayTime = setTimeout(function () {
                        _this2.changeState({
                            request: true
                        });
                    }, delay);
                }
                if (isTimeout) {
                    this.timeoutTime = setTimeout(function () {
                        _this2.clearTime();
                        _this2.changeState({
                            request: false,
                            err: 'timeout'
                        });
                    }, timeout);
                }
                load().then(function (component) {
                    _this2.clearTime();
                    var comp = (0, _util.getModule)(component);
                    _this2.changeState({
                        comp: comp,
                        request: false,
                        err: ''
                    });
                    _this2.loadedCb(comp, false);
                }).catch(function (e) {
                    _this2.clearTime();
                    _this2.changeState({
                        request: false,
                        err: e
                    });
                });
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.unmount = true;
            }
        }, {
            key: 'render',
            value: function render() {
                var _state = this.state,
                    request = _state.request,
                    err = _state.err,
                    LoadComponent = _state.comp,
                    otherState = _objectWithoutProperties(_state, ['request', 'err', 'comp']);

                if (request) {
                    return LoadingView();
                } else if (err !== '') {
                    return ErrorView({
                        onRetry: this.retry,
                        error: err
                    });
                }
                if (!LoadComponent) {
                    return null;
                }

                var _props = this.props,
                    report = _props.report,
                    overProps = _objectWithoutProperties(_props, ['report']);

                if (overProps.receiveData) {
                    overProps.receiveData = customData(overProps.receiveData, chunkName);
                }
                return isHasRender ? _render(overProps, LoadComponent) : _react2.default.createElement(LoadComponent, _extends({}, overProps, otherState));
            }
        }]);

        return AsyncComponent;
    }(_react.Component);

    AsyncComponent.chunkName = chunkName;

    return (0, _reactAsyncmoduleChunk.withConsumer)(AsyncComponent);
};

var Asyncimport = function Asyncimport() {
    var initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var mergeOption = (0, _util.shallowCopy)({}, DEFAULTOPTIONS, initOptions);
    // `load` exist
    if (mergeOption.load) {
        return Dueimport(mergeOption);
    }
    return function () {
        var stepOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var afterOption = (0, _util.shallowCopy)({}, mergeOption, stepOption);
        return Dueimport(afterOption);
    };
};

exports.default = Asyncimport;
module.exports = exports['default'];