import { asyncReady } from '../src';
import { getAsyncChunkKey } from '../src/util';

class mockArray {
    constructor(val) {
        this.arr = [];
        this.push = this.push.bind(this);
        this.some = this.some.bind(this);
        if (val) {
            this.push(val);
        }
    }

    valueOf() {
        return this.arr;
    }

    push(...args) {
        this.arr.push(...args);
    }

    some(func) {
        return this.arr.some(func);
    }
}

describe('asyncReady asyncChunks exist', () => {
    let script;
    beforeAll(() => {
        script = document.createElement('script');
        script.type = 'application/json';
        script.id = getAsyncChunkKey();
        script.textContent = JSON.stringify(['chunkA', 'chunkB']);
        document.body.appendChild(script);
        window.webpackJsonp = new mockArray([['chunkA'], { '07G2': () => {} }]);
    });
    afterAll(() => {
        script.parentNode.removeChild(script);
        delete window.webpackJsonp;
    });
    test('normal', (done) => {
        expect.assertions(2);
        const doneMock = jest.fn();
        expect(asyncReady(doneMock)).toBeInstanceOf(Promise);
        setTimeout(() => {
            window.webpackJsonp.push([['chunkB'], { '07G2': () => {} }]);
            expect(doneMock.mock.calls).toHaveLength(1);
            done();
        }, 100);
    });
});

describe('asyncReady no asyncChunks', () => {
    test('no asyncChunks', () => {
        const doneMock = jest.fn();
        expect(asyncReady(doneMock)).toBeInstanceOf(Promise);
    });
});