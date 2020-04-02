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
        expect.assertions(4);
        const doneMock = jest.fn();
        expect(asyncReady(doneMock)).toBeInstanceOf(Promise);
        setTimeout(() => {
            window.webpackJsonp.push([['chunkB'], { '07G2': () => {} }]);
            expect(doneMock.mock.calls).toHaveLength(1);
            // 已经完成后再触发不会执行done
            window.webpackJsonp.push([['chunkC'], { '07G3': () => {} }]);
            expect(doneMock.mock.calls).toHaveLength(1);
            expect(window.webpackJsonp.arr).toHaveLength(3);
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