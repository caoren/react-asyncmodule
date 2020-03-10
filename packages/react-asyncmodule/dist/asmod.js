

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _createClass = (function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _hoistNonReactStatics = require('hoist-non-react-statics');

const _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

const _reactAsyncmoduleChunk = require('react-asyncmodule-chunk');

const _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { const target = {}; for (const i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === 'object' || typeof call === 'function') ? call : self; }

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError(`Super expression must either be null or a function, not ${typeof superClass}`); } subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass, enumerable: false, writable: true, configurable: true
        }
    }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

const TIMEOUT = 120000;
const DELAY = 200;
const packComponent = function packComponent(comp) {
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
const customData = function customData() {
    const data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const chunkName = arguments[1];
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
const DEFAULTOPTIONS = {
    load: null,
    render: null,
    resolveWeak: null,
    loading: null,
    error: null,
    delay: DELAY,
    timeout: TIMEOUT,
    onModuleLoaded: null
};
const Dueimport = function Dueimport() {
    const option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const { load } = option;
    const _render = option.render;
    const { loading } = option;
    const { error } = option;
    const { delay } = option;
    const { timeout } = option;
    const { resolveWeak } = option;
    const { chunk } = option;
    const { onModuleLoaded } = option;

    if (!load) {
        return null;
    }
    const isHasRender = typeof _render === 'function';
    const chunkName = typeof chunk === 'function' ? chunk() : '';
    // The first letter of the react component
    // name is uppercase
    const LoadingView = packComponent(loading);
    const ErrorView = packComponent(error);
    const isDelay = typeof delay === 'number' && delay !== 0;
    const isTimeout = typeof timeout === 'number' && timeout !== 0;

    const AsyncComponent = (function (_Component) {
        _inherits(AsyncComponent, _Component);

        _createClass(AsyncComponent, null, [{
            key: 'preload',
            value: function preload() {
                const comp = (0, _util.syncModule)(resolveWeak);
                return Promise.resolve().then(() => {
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

            const _this = _possibleConstructorReturn(this, (AsyncComponent.__proto__ || Object.getPrototypeOf(AsyncComponent)).call(this, props));

            _this.unmount = false;
            const { report } = props;

            const comp = (0, _util.syncModule)(resolveWeak, load);
            if (report && comp) {
                const exportStatic = {};
                (0, _hoistNonReactStatics2.default)(exportStatic, comp);
                exportStatic.chunkName = chunkName;
                report(exportStatic);
            }
            _this.state = {
                comp,
                err: '',
                request: !isDelay
            };
            _this.retry = _this.retry.bind(_this);
            _this.changeState = _this.changeState.bind(_this);
            if (!comp) {
                _this.loadComp();
            } else if (onModuleLoaded) {
                onModuleLoaded(comp, chunkName, (0, _util.isServer)());
            }
            return _this;
        }

        _createClass(AsyncComponent, [{
            key: 'changeState',
            value: function changeState() {
                const state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
                const _this2 = this;

                if (isDelay) {
                    this.delayTime = setTimeout(() => {
                        _this2.changeState({
                            request: true
                        });
                    }, delay);
                }
                if (isTimeout) {
                    this.timeoutTime = setTimeout(() => {
                        _this2.clearTime();
                        _this2.changeState({
                            request: false,
                            err: 'timeout'
                        });
                    }, timeout);
                }
                load().then((component) => {
                    _this2.clearTime();
                    const comp = (0, _util.getModule)(component);
                    _this2.changeState({
                        comp,
                        request: false,
                        err: ''
                    });
                    if (onModuleLoaded) {
                        onModuleLoaded(comp, chunkName, false);
                    }
                }).catch((e) => {
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
                const _state = this.state;
                const { request } = _state;
                const { err } = _state;
                const LoadComponent = _state.comp;

                if (request) {
                    return LoadingView();
                } if (err !== '') {
                    return ErrorView({
                        onRetry: this.retry,
                        error: err
                    });
                }
                if (!LoadComponent) {
                    return null;
                }

                const _props = this.props;
                const { report } = _props;
                const overProps = _objectWithoutProperties(_props, ['report']);

                if (overProps.receiveData) {
                    overProps.receiveData = customData(overProps.receiveData, chunkName);
                }
                return isHasRender ? _render(overProps, LoadComponent) : _react2.default.createElement(LoadComponent, overProps);
            }
        }]);

        return AsyncComponent;
    }(_react.Component));

    AsyncComponent.chunkName = chunkName;

    return (0, _reactAsyncmoduleChunk.withConsumer)(AsyncComponent);
};

const Asyncimport = function Asyncimport() {
    const initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const mergeOption = (0, _util.shallowCopy)({}, DEFAULTOPTIONS, initOptions);
    // `load` exist
    if (mergeOption.load) {
        return Dueimport(mergeOption);
    }
    return function () {
        const stepOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        const afterOption = (0, _util.shallowCopy)({}, mergeOption, stepOption);
        return Dueimport(afterOption);
    };
};

exports.default = Asyncimport;
module.exports = exports.default;