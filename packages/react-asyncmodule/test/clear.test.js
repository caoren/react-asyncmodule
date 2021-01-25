/* eslint-disable */
import React, { Component } from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AsyncModule from '../src/index';
import clearWebpackCache from '../src/clear';

configure({ adapter: new Adapter() });

const stats = {
    remotesRelatedDepends: [
        'webpack/container/reference/look_common',
        './client/list'
    ],
    remotesMap: {
        a: [],
        b: []
    }
};

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div />);
    }
}
Home.getData = () => {}
Home.testProperty = 'test';

const loadcomp = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(Home);
    }, 500);
});

const mcache = {
    'webpack/container/reference/look_common': () => {},
    './client/home': () => {}
}
describe('clearWebpackCache', () => {
    beforeAll(() => {
        const maparr = [];
        maparr.p = 1;
        global.__webpack_require__ = {
            mcache: Object.assign(mcache),
            __installedChunks__: {
                a: 0
            },
            __idToExternalAndNameMapping__: {
                "webpack/container/reference/look_common": maparr
            }
        }
        global.__webpack_modules__ = {
            './client/home': () => {} 
        }
    });
    afterAll(() => {
        delete global.__webpack_require__;
    });
    test('default', () => {
        AsyncModule({
            load: loadcomp,
            resolveWeak: () => './client/home',
            chunk: () => 'a'
        });
        clearWebpackCache(stats);
        expect(global.__webpack_require__.mcache).toEqual({});
        expect(global.__webpack_require__.__installedChunks__).toEqual({});
        expect(global.__webpack_require__.__idToExternalAndNameMapping__).toEqual({
            "webpack/container/reference/look_common": []
        });
        expect(global.__webpack_modules__).toEqual({});
    });

    test('stats empty', () => {
        clearWebpackCache();
        expect(global.__webpack_require__.mcache).toEqual(mcache);
    });
});