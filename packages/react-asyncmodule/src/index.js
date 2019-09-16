import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { withConsumer } from 'react-asyncmodule-chunk';
import { shallowCopy, getModule, syncModule, isServer } from './util';

const TIMEOUT = 120000;
const DELAY = 200;
const packComponent = comp => (props) => {
    if (!comp) {
        return null;
    }
    // class function
    if (React.isValidElement(comp)) {
        return React.cloneElement(comp, props);
    }
    return React.createElement(comp, props);
};
const customData = (data = {}, chunkName) => data[chunkName];

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
const Dueimport = (option = {}) => {
    const {
        load,
        render,
        loading,
        error,
        delay,
        timeout,
        resolveWeak,
        chunk,
        onModuleLoaded
    } = option;
    if (!load) {
        return null;
    }
    const isHasRender = typeof render === 'function';
    const chunkName = typeof chunk === 'function' ? chunk() : '';
    // The first letter of the react component
    // name is uppercase
    const LoadingView = packComponent(loading);
    const ErrorView = packComponent(error);
    const isDelay = typeof delay === 'number' && delay !== 0;
    const isTimeout = typeof timeout === 'number' && timeout !== 0;
    class AsyncComponent extends Component {
        static preload() {
            const comp = syncModule(resolveWeak);
            return Promise.resolve().then(() => {
                if (comp) {
                    return comp;
                }
                return load();
            });
        }

        static preloadWeak() {
            return syncModule(resolveWeak);
        }

        static chunkName = chunkName;

        constructor(props) {
            super(props);
            this.unmount = false;
            const { report } = props;
            const comp = syncModule(resolveWeak, load);
            if (report && comp) {
                const exportStatic = {};
                hoistNonReactStatics(exportStatic, comp);
                exportStatic.chunkName = chunkName;
                report(exportStatic);
            }
            this.state = {
                comp,
                err: '',
                request: !isDelay
            };
            this.retry = this.retry.bind(this);
            this.changeState = this.changeState.bind(this);
            if (!comp) {
                this.loadComp();
            } else if (onModuleLoaded) {
                onModuleLoaded(comp, chunkName, isServer());
            }
        }

        changeState(state = {}) {
            if (this.unmount) {
                return false;
            }
            return this.setState(state);
        }

        retry() {
            this.loadComp();
        }

        clearTime() {
            if (this.delayTime) {
                clearTimeout(this.delayTime);
                delete this.delayTime;
            }
            if (this.timeoutTime) {
                clearTimeout(this.timeoutTime);
                delete this.timeoutTime;
            }
        }

        loadComp() {
            if (isDelay) {
                this.delayTime = setTimeout(() => {
                    this.changeState({
                        request: true
                    });
                }, delay);
            }
            if (isTimeout) {
                this.timeoutTime = setTimeout(() => {
                    this.clearTime();
                    this.changeState({
                        request: false,
                        err: 'timeout'
                    });
                }, timeout);
            }
            load().then((component) => {
                this.clearTime();
                const comp = getModule(component);
                this.changeState({
                    comp,
                    request: false,
                    err: ''
                });
                if (onModuleLoaded) {
                    onModuleLoaded(comp, chunkName, false);
                }
            }).catch((e) => {
                this.clearTime();
                this.changeState({
                    request: false,
                    err: e
                });
            });
        }

        componentWillUnmount() {
            this.unmount = true;
        }

        render() {
            const {
                request,
                err,
                comp: LoadComponent
            } = this.state;
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
            const { report, ...overProps } = this.props;
            if (overProps.receiveData) {
                overProps.receiveData = customData(overProps.receiveData, chunkName);
            }
            return isHasRender
                ? render(overProps, LoadComponent)
                : (<LoadComponent {...overProps} />);
        }
    }
    return withConsumer(AsyncComponent);
};

const Asyncimport = (initOptions = {}) => {
    const mergeOption = shallowCopy({}, DEFAULTOPTIONS, initOptions);
    // `load` exist
    if (mergeOption.load) {
        return Dueimport(mergeOption);
    }
    return (stepOption = {}) => {
        const afterOption = shallowCopy({}, mergeOption, stepOption);
        return Dueimport(afterOption);
    };
};

export default Asyncimport;