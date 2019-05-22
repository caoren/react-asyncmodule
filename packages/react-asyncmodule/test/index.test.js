/* eslint-disable */
import React, { Component } from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AsyncModule from '../src/index';

configure({ adapter: new Adapter() });

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="m-home">
                首页
            </div>
        );
    }
}

const Loading = () => (<div className="m-loading">加载中...</div>);
const ErrorView = ({ onRetry }) => (<div className="m-error" onClick={onRetry}>加载失败</div>);

beforeAll(() => {
    global.__webpack_require__ = (id) => {
        if (id === 1) {
            return Home;
        }
        return null;
    }
    global.__webpack_modules__ = {
        1: { a: 1 }
    }
});
afterAll(() => {
    delete global.__webpack_require__;
    delete global.__webpack_modules__;
});
describe('AsyncModule memory', () => {
    beforeAll(() => {
        global.AsyncCommon = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            delay: 100,
            timeout: 0
        });
    });
    afterAll(() => {
        delete global.AsyncCommon;
    });
    test('client found', (done) => {
        expect.assertions(5);
        const mockLoaded = jest.fn((comp, chunkName, isServer) => {
            expect(comp).toEqual(Home);
            expect(chunkName).toBe('home');
            expect(isServer).toBeFalsy();
            done();
        });
        const AsyncComponent = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            timeout: 0,
            onModuleLoaded: mockLoaded
        });
        const ViewFirst = AsyncComponent({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 1,
            chunk: () => 'home'
        });
        const app = mount(<ViewFirst />);
        expect(app.html()).toBe('<div class="m-home">首页</div>');
        expect(mockLoaded).toHaveBeenCalledTimes(1);
    });
    test('client timeout', () => {
        const AsyncComponent = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            timeout: 100
        });
        const ViewTime = AsyncComponent({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 2
        });
        jest.useFakeTimers();
        const app = mount(<ViewTime />);
        jest.advanceTimersByTime(100);
        expect(app.html()).toBe('<div class="m-error">加载失败</div>');
        jest.useRealTimers();
    });
    test('client not found 2', (done) => {
        expect.assertions(4);
        const ViewSecond = AsyncCommon({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 2
        });
        jest.useFakeTimers();
        const app = mount(<ViewSecond />);
        // delay time and load time
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(app.html()).toBeNull();
        jest.advanceTimersByTime(300);
        expect(app.html()).toBe('<div class="m-loading">加载中...</div>');
        jest.advanceTimersByTime(600);
        jest.useRealTimers();
        // react render need a little time
        setTimeout(() => {
            expect(app.html()).toBe('<div class="m-home">首页</div>');
            done();
        }, 100);
    });
    test('client found error', (done) => {
        expect.assertions(1);
        const ViewThrid = AsyncCommon({
            load: () => Promise.reject('load err'),
            resolveWeak: () => 2
        });
        jest.useFakeTimers();
        const app = mount(<ViewThrid />);
        jest.advanceTimersByTime(300);
        jest.useRealTimers();
        setTimeout(() => {
            expect(app.html()).toBe('<div class="m-error">加载失败</div>');
            done();
        }, 100);
    });
    test('client found error try', (done) => {
        expect.assertions(1);
        const ViewFouth = AsyncCommon({
            load: () => Promise.reject('load err'),
            resolveWeak: () => 2
        });
        const app = mount(<ViewFouth />);
        setTimeout(() => {
            app.simulate('click');
            expect(app.html()).toBe('<div class="m-error">加载失败</div>');
            done();
        }, 200);
    });
});

describe('AsyncModule static method', () => {
    test('preload sync succ', (done) => {
        const AsyncComponent = AsyncModule({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 1,
            loading: <Loading />,
            error: <ErrorView />
        });
        const comp = AsyncComponent.preload();
        comp.then((comp) => {
            expect(comp).toEqual(Home);
            done();
        });
    });
    test('preload async succ', (done) => {
        const AsyncComponent = AsyncModule({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 2,
            loading: <Loading />,
            error: <ErrorView />
        });
        const comp = AsyncComponent.preload();
        comp.then((comp) => {
            expect(comp).toEqual(Home);
            done();
        });
    });
    test('preloadWeak succ', () => {
        const AsyncComponent = AsyncModule({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 1,
            loading: <Loading />,
            error: <ErrorView />
        });
        const comp = AsyncComponent.preloadWeak();
        expect(comp).toEqual(Home);
    });
    test('preloadWeak fail', () => {
        const AsyncComponent = AsyncModule({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 2,
            loading: <Loading />,
            error: <ErrorView />
        });
        const comp = AsyncComponent.preloadWeak();
        expect(comp).toBeNull();
    });
});

describe('AsyncModule once', () => {
    test('client found', () => {
        const SyncCom = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            timeout: 0,
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 100);
            }),
            resolveWeak: () => 1
        });
        const app = shallow(<SyncCom />);
        expect(app.html()).toBe('<div class="m-home">首页</div>');
    });
    test('param not load', () => {
        const SyncCom = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            timeout: 0
        })();
        expect(SyncCom).toBeNull();
    });
});

class Loadtm extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (<div>加载中...</div>);
    }
}
describe('AsyncModule error', () => {
    test('class loading', (done) => {
        expect.assertions(2);
        const mockLoaded = jest.fn();
        const SyncCom = AsyncModule({
            loading: Loadtm,
            delay: 0,
            timeout: 0,
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 100);
            }),
            resolveWeak: () => 2,
            onModuleLoaded: mockLoaded
        });
        const app = mount(<SyncCom />);
        setTimeout(() => {
            expect(app.html()).toBe('<div class="m-home">首页</div>');
            expect(mockLoaded.mock.calls).toHaveLength(1);
            done();
        }, 200);
    });
    test('error null', (done) => {
        expect.assertions(1);
        const SyncCom = AsyncModule({
            loading: Loadtm,
            delay: 0,
            timeout: 0,
            load: () => Promise.reject('err'),
            resolveWeak: () => 2
        });
        const app = mount(<SyncCom />);
        setTimeout(() => {
            expect(app.html()).toBeNull();
            done();
        }, 200);
    });
});