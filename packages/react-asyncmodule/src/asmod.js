import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { withConsumer } from 'react-asyncmodule-chunk';
import {
    shallowCopy,
    getModule,
    syncModule,
    isServer
} from './util';

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
 * 存储所有 module, key 为 weakId
 * {
 *      [chunkName]: {
 *          weakId,
 *          chunkName,
 *          preload
 *      }
 * }
 */
const ASYNCMODULE_ALLMODULE = {};
export const AsyncOperate = {
    get(chunkName) {
        if (chunkName) {
            return ASYNCMODULE_ALLMODULE[chunkName];
        }
        return ASYNCMODULE_ALLMODULE;
    },
    set(data) {
        const {
            chunkName
        } = data;
        if (ASYNCMODULE_ALLMODULE[chunkName]) {
            return;
        }
        ASYNCMODULE_ALLMODULE[chunkName] = data;
    },
    // 只清除挂载在 webpack 上的 module
    remove(data) {
        if (data) {
            const { weekId } = data;
            if (__webpack_modules__[weekId]) { // eslint-disable-line
                __webpack_modules__[weekId] = undefined; // eslint-disable-line
            }
        } else {
            Object.keys(ASYNCMODULE_ALLMODULE).forEach((item) => {
                const curItem = ASYNCMODULE_ALLMODULE[item];
                if (curItem) {
                    AsyncOperate.remove(curItem);
                }
            });
        }
    }
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
 * @onBeforeRender before component render callback
 */
const DEFAULTOPTIONS = {
    load: null,
    render: null,
    resolveWeak: null,
    loading: null,
    error: null,
    delay: DELAY,
    timeout: TIMEOUT,
    onModuleLoaded: null,
    onBeforeRender: null
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
        onModuleLoaded,
        onBeforeRender
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
    const weekId = resolveWeak ? resolveWeak() : null;
    const preload = () => {
        const comp = syncModule(resolveWeak);
        return Promise.resolve().then(() => {
            if (comp) {
                return comp;
            }
            return load();
        });
    };
    AsyncOperate.set({
        weekId,
        chunkName,
        preload
    });
    class AsyncComponent extends Component {
        static preload = preload;

        static preloadWeak() {
            return syncModule(resolveWeak);
        }

        static chunkName = chunkName;

        constructor(props) {
            super(props);
            this.unmount = false;
            const { report, ...otherProps } = props;
            const comp = syncModule(resolveWeak, load);
            if (report && comp) {
                const exportStatic = {};
                hoistNonReactStatics(exportStatic, comp);
                exportStatic.chunkName = chunkName;
                exportStatic.__transmitProps__ = otherProps; // eslint-disable-line
                report(exportStatic);
            }
            this.state = {
                comp,
                err: '',
                request: !isDelay
            };
            this.retry = this.retry.bind(this);
            this.changeState = this.changeState.bind(this);
            this.loadedCb = this.loadedCb.bind(this);
            if (!comp) {
                this.loadComp();
            } else {
                this.beforeRenderCb(comp);
                this.loadedCb(comp, isServer());
            }
        }

        loadedCb(comp, inServer) {
            if (onModuleLoaded) {
                onModuleLoaded({
                    chunkName,
                    props: this.props,
                    isServer: inServer,
                    component: comp,
                    setState: this.changeState
                });
            }
        }

        beforeRenderCb(comp) {
            if (onBeforeRender) {
                onBeforeRender(comp);
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
                this.beforeRenderCb(comp);
                this.changeState({
                    comp,
                    request: false,
                    err: ''
                });
                this.loadedCb(comp, false);
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
                comp: LoadComponent,
                ...otherState
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
            let { report, ...overProps } = this.props;
            if (overProps.receiveData) {
                overProps = {
                    ...overProps,
                    ...customData(overProps.receiveData, chunkName)
                };
                delete overProps.receiveData;
            }

            return isHasRender
                ? render(overProps, LoadComponent)
                : (<LoadComponent {...overProps} {...otherState} />);
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