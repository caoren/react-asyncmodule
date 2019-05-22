import React, { Component } from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AsyncChunk from '../src/asyncchunk';
import AsyncModule from '../src/index';

configure({ adapter: new Adapter() });

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { receiveData } = this.props;
        const { c } = receiveData || {};
        const text = c ? `首页${c}` : '';
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

describe('Asyncchunk', () => {
    const AsyncComponent = AsyncModule({
        load: () => new Promise((resolve) => {
            setTimeout(() => {
                resolve(Home);
            }, 500);
        }),
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
    test('custom receiveData', () => {
        const receiveData = { b : { c: 2 } };
        const AsyncComponentsec = AsyncModule({
            load: () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Home);
                }, 500);
            }),
            resolveWeak: () => 1,
            loading: <Loading />,
            error: <ErrorView />,
            chunk: () => 'b'
        });
        const app = mount(
            <AsyncChunk receiveData={receiveData}>
                <AsyncComponentsec />
            </AsyncChunk>
        );
        expect(app.html()).toBe('<div class="m-home">首页2</div>');
    });
});