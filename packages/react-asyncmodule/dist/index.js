

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _createClass = (function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        // class function
        if (typeof comp === 'function') {
            return _react2.default.createElement(comp, props);
        } else if (comp && (typeof comp === 'undefined' ? 'undefined' : _typeof(comp)) === 'object') {
            return _react2.default.cloneElement(comp, props);
        }
        return null;
    };
};
/*
 * options
 * @load `function` return a `Promise` instance
 * @resolveWeak `function` return webpack moduleid
 * @loading `React Element`
 * @error `React Element`
 * @delay `number` ms, loading view delay display
 * @timeout `number` ms, load timeout time
 */
const DEFAULTOPTIONS = {
    load: null,
    resolveWeak: null,
    loading: null,
    error: null,
    delay: DELAY,
    timeout: TIMEOUT
};
const Dueimport = function Dueimport() {
    const option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let load = option.load,
        loading = option.loading,
        error = option.error,
        delay = option.delay,
        timeout = option.timeout,
        resolveWeak = option.resolveWeak;

    if (!load) {
        return null;
    }
    // The first letter of the react component
    // name is the uppercase
    const LoadingView = packComponent(loading);
    const ErrorView = packComponent(error);
    const isDelay = typeof delay === 'number' && delay !== 0;
    const isTimeout = typeof timeout === 'number' && timeout !== 0;
    const preload = function preload() {
        return load();
    };

    const AsyncComponent = (function (_Component) {
        _inherits(AsyncComponent, _Component);

        function AsyncComponent(props) {
            _classCallCheck(this, AsyncComponent);

            const _this = _possibleConstructorReturn(this, (AsyncComponent.__proto__ || Object.getPrototypeOf(AsyncComponent)).call(this, props));

            _this.unmount = false;

            let _resolving = (0, _util.resolving)(load, resolveWeak),
                loaded = _resolving.loaded,
                cur = _resolving.cur;

            _this.state = {
                needDelay: isDelay,
                err: '',
                request: !loaded,
                LoadComponent: loaded ? cur : null
            };
            _this.retry = _this.retry.bind(_this);
            _this.changeState = _this.changeState.bind(_this);
            _this.inital = true;
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
                            needDelay: false
                        });
                    }, delay);
                }
                if (isTimeout) {
                    this.timeoutTime = setTimeout(() => {
                        _this2.changeState({
                            request: false,
                            err: 'timeout'
                        });
                    }, timeout);
                }
                if (!this.inital) {
                    this.changeState({
                        request: true,
                        err: '',
                        needDelay: isDelay
                    });
                }
                preload().then((component) => {
                    _this2.clearTime();
                    _this2.changeState({
                        request: false,
                        err: '',
                        LoadComponent: component
                    });
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
            key: 'componentDidMount',
            value: function componentDidMount() {
                // client
                const request = this.state.request;

                if (request) {
                    this.loadComp();
                    delete this.inital;
                }
            }
        }, {
            key: 'render',
            value: function render() {
                let _state = this.state,
                    request = _state.request,
                    needDelay = _state.needDelay,
                    err = _state.err,
                    LoadComponent = _state.LoadComponent;

                if (request) {
                    // empty
                    if (needDelay) {
                        return null;
                    }
                    return LoadingView();
                } else if (err !== '') {
                    return ErrorView({
                        onRetry: this.retry,
                        error: err
                    });
                }
                return _react2.default.createElement(LoadComponent, this.props);
            }
        }]);

        return AsyncComponent;
    }(_react.Component));

    AsyncComponent.preload = preload;
    return AsyncComponent;
};
const Asyncimport = function Asyncimport() {
    const initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const dueOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    const mergeOption = (0, _util.shallowCopy)({}, DEFAULTOPTIONS, initOptions, dueOptions);
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