import React, { Component } from 'react';
import { resolving, shallowCopy, getModule } from './util';
import { withConsumer } from './asynccontext';
import AsyncChunk from './asyncchunk';

const TIMEOUT = 120000;
const DELAY = 200;
const packComponent = comp => (props) => {
    // class function
    if (typeof comp === 'function') {
        return React.createElement(comp, props);
    } else if (comp && typeof comp === 'object') {
        return React.cloneElement(comp, props);
    }
    return null;
};
const defaultCustomData = data => data;
/*
 * options
 * @load `function` return a `Promise` instance
 * @render `function` custom render
 * @customData `function` custom receiveData
 * @resolveWeak `function` return webpack moduleid
 * @loading `React Element`
 * @error `React Element`
 * @delay `number` ms, loading view delay display
 * @timeout `number` ms, load timeout time
 */
const DEFAULTOPTIONS = {
    load: null,
    render: null,
    customData: defaultCustomData,
    resolveWeak: null,
    loading: null,
    error: null,
    delay: DELAY,
    timeout: TIMEOUT
};
const Dueimport = (option = {}) => {
    const {
        load,
        render,
        customData,
        loading,
        error,
        delay,
        timeout,
        resolveWeak,
        chunk
    } = option;
    if (!load) {
        return null;
    }
    const isHasRender = typeof render === 'function';
    const chunkName = typeof chunk === 'function' ? chunk() : '';
    // The first letter of the react component
    // name is the uppercase
    const LoadingView = packComponent(loading);
    const ErrorView = packComponent(error);
    const isDelay = typeof delay === 'number' && delay !== 0;
    const isTimeout = typeof timeout === 'number' && timeout !== 0;
    const preload = () => load();
    const preloadWeak = () => {
        const { loaded, cur } = resolving(load, resolveWeak);
        if (loaded) {
            return cur;
        }
        return null;
    }
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);
            this.unmount = false;
            const { report } = props;
            const { loaded, cur } = resolving(load, resolveWeak);
            if (report && loaded) {
                const exportStatic = {
                    chunkName: cur.chunkName,
                    getInitialData: cur.getInitialData
                }
                if (typeof exportStatic.chunkName === 'undefined') {
                    exportStatic.chunkName = chunkName;
                }
                report(exportStatic);
            }
            this.state = {
                needDelay: isDelay,
                err: '',
                request: !loaded,
                LoadComponent: loaded ? cur : null
            };
            this.retry = this.retry.bind(this);
            this.changeState = this.changeState.bind(this);
            this.inital = true;
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
                        needDelay: false
                    });
                }, delay);
            }
            if (isTimeout) {
                this.timeoutTime = setTimeout(() => {
                    this.changeState({
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
                this.clearTime();
                this.changeState({
                    request: false,
                    err: '',
                    LoadComponent: getModule(component)
                });
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
        componentDidMount() {
            // client
            const { request } = this.state;
            if (request) {
                this.loadComp();
                delete this.inital;
            }
        }
        render() {
            const {
                request,
                needDelay,
                err,
                LoadComponent
            } = this.state;
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
            const { report, ...overProps } = this.props;
            if (overProps.receiveData) {
                overProps.receiveData = customData(overProps.receiveData);
            }
            return isHasRender ? render(overProps, LoadComponent) : (<LoadComponent {...overProps} />);
        }
    }
    AsyncComponent.chunkName = chunkName;
    AsyncComponent.preload = preload;
    AsyncComponent.preloadWeak = preloadWeak;
    return withConsumer(AsyncComponent);
};
const Asyncimport = (initOptions = {}, dueOptions = {}) => {
    const mergeOption = shallowCopy({}, DEFAULTOPTIONS, initOptions, dueOptions);
    // `load` exist
    if (mergeOption.load) {
        return Dueimport(mergeOption);
    }
    return (stepOption = {}) => {
        const afterOption = shallowCopy({}, mergeOption, stepOption);
        return Dueimport(afterOption);
    };
};
export { AsyncChunk };
export default Asyncimport;