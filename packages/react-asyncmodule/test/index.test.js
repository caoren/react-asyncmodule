/* eslint-disable */
import React, { Component } from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AsyncChunk from 'react-asyncmodule-chunk';
import AsyncModule from '../src/index';

configure({ adapter: new Adapter() });

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { c } = this.props;
        // const { c } = receiveData || {};
        const text = c ? `首页${c}` : '首页';
        return (
            <div className="m-home">
                {text}
            </div>
        );
    }
}
Home.getData = () => {}
Home.testProperty = 'test';

const Loading = () => (<div className="m-loading">加载中...</div>);
const ErrorView = ({ onRetry, error }) => (<div className="m-error" onClick={onRetry}>加载失败</div>);

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

const loadcomp = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(Home);
    }, 500);
});

const waitFunc = (delay) => new Promise((resolve) => {
    setTimeout(resolve, delay);
});

describe('AsyncModule memory', () => {
    beforeEach(() => {
        global.AsyncCommon = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            delay: 100,
            timeout: 0
        });
    });
    afterEach(() => {
        delete global.AsyncCommon;
    });

    test('client found', (done) => {
        expect.assertions(6);
        const mockBeforeRender = jest.fn();
        const mockLoaded = jest.fn(({ component, chunkName, isServer }) => {
            expect(mockBeforeRender).toHaveBeenCalledTimes(1);
            expect(component).toEqual(Home);
            expect(chunkName).toBe('home');
            expect(isServer).toBeFalsy();
            done();
        });
        const AsyncComponent = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            timeout: 0,
            onBeforeRender: mockBeforeRender,
            onModuleLoaded: mockLoaded
        });
        const ViewFirst = AsyncComponent({
            load: loadcomp,
            resolveWeak: () => 1,
            chunk: () => 'home'
        });
        const app = mount(<ViewFirst />);
        expect(app.html()).toBe('<div class="m-home">首页</div>');
        expect(mockLoaded).toHaveBeenCalledTimes(1);
    });

    test('client timeout', async () => {
        const AsyncComponent = AsyncModule({
            loading: <Loading />,
            error: <ErrorView />,
            timeout: 100
        });
        const ViewTime = AsyncComponent({
            load: loadcomp,
            resolveWeak: () => 2
        });
        const app = mount(<ViewTime />);
        await waitFunc(200);
        app.update();
        expect(app.html()).toBe('<div class="m-error">加载失败</div>');
    });

    test('client not found 2', async () => {
        const mockLoaded = jest.fn();
        const ViewSecond = AsyncCommon({
            load: loadcomp,
            resolveWeak: () => 2,
            onModuleLoaded: mockLoaded
        });
        const app = mount(<ViewSecond />);
        expect(app.html()).toBe('');
        await waitFunc(300);
        app.update();
        expect(app.html()).toBe('<div class="m-loading">加载中...</div>');
        await waitFunc(600);
        app.update();
        expect(mockLoaded).toHaveBeenCalledTimes(1);
        expect(app.html()).toBe('<div class="m-home">首页</div>');
    });
    test('client found error', async () => {
        const ViewThrid = AsyncCommon({
            load: () => Promise.reject('load err'),
            resolveWeak: () => 2
        });
        const app = mount(<ViewThrid />);
        await waitFunc(300);
        app.update();
        expect(app.html()).toBe('<div class="m-error">加载失败</div>');
    });

    test('client found error try', async () => {
        expect.assertions(1);
        const ViewFouth = AsyncCommon({
            load: () => Promise.reject('load err'),
            resolveWeak: () => 2,
            error: ({ onRetry, error }) => (<div className="m-error" onClick={onRetry}>加载失败</div>)
        });
        const app = mount(<ViewFouth />);
        await waitFunc(200);
        app.simulate('click');
        expect(app.html()).toBe('<div class="m-error">加载失败</div>');
    });
});

describe('AsyncModule static method', () => {

    test('preload sync succ', (done) => {
        const AsyncComponent = AsyncModule({
            load: loadcomp,
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
            load: loadcomp,
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
            load: loadcomp,
            resolveWeak: () => 1,
            loading: <Loading />,
            error: <ErrorView />
        });
        const comp = AsyncComponent.preloadWeak();
        expect(comp).toEqual(Home);
    });

    test('preloadWeak fail', () => {
        const AsyncComponent = AsyncModule({
            load: loadcomp,
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
            load: loadcomp,
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
    test('class loading', async () => {
        const SyncCom = AsyncModule({
            loading: Loadtm,
            delay: 0,
            timeout: 0,
            load: loadcomp,
            resolveWeak: () => 2
        });
        const app = mount(<SyncCom />);
        await waitFunc(600);
        app.update();
        expect(app.html()).toBe('<div class="m-home">首页</div>');
    });

    test('error null', async () => {
        const SyncCom = AsyncModule({
            loading: Loadtm,
            delay: 0,
            timeout: 0,
            load: () => Promise.reject('err'),
            resolveWeak: () => 2
        });
        const app = mount(<SyncCom />);
        await waitFunc(200);
        app.update();
        expect(app.html()).toBe('');
    });
});

describe('AsyncChunk', () => {
    const AsyncComponent = AsyncModule({
        load: () => loadcomp,
        resolveWeak: () => 1,
        loading: <Loading />,
        error: <ErrorView />,
        chunk: () => 'testa'
    });

    test('report', () => {
        const modules = [];
        const report = (module) => modules.push(module);
        const app = mount(
            <AsyncChunk report={report}>
                <AsyncComponent />
            </AsyncChunk>
        );
        expect(modules).toHaveLength(1);
        expect(modules[0].chunkName).toBe('testa');
        expect(modules[0].testProperty).toBe('test');
        expect(modules[0].getData).toBeInstanceOf(Function);
    });
    
    test('receiveData', () => {
        const receiveData = { testa:  { c: 1 } };
        const app = mount(
            <AsyncChunk receiveData={receiveData}>
                <AsyncComponent />
            </AsyncChunk>
        );
        expect(app.html()).toBe('<div class="m-home">首页1</div>');
    });
});