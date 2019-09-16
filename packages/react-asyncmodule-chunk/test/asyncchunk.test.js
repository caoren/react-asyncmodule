import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AsyncChunk, { withConsumer } from '../src/index';

configure({ adapter: new Adapter() });

const customData = (data = {}, chunkName) => data[chunkName];
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

const AsyncModule = (options) => {
    const chunkName = options.chunk();
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);
            const { report } = props;
            if (report) {
                const exportStatic = {};
                hoistNonReactStatics(exportStatic, Home);
                exportStatic.chunkName = chunkName;
                report(exportStatic);
            }
        }
        render() {
            const { report, ...overProps } = this.props;
            if (overProps.receiveData) {
                overProps.receiveData = customData(overProps.receiveData, chunkName);
            }
            return (<Home {...overProps} />);
        }
    }
    return withConsumer(AsyncComponent);
}

describe('Asyncchunk', () => {
    const AsyncComponent = AsyncModule({
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