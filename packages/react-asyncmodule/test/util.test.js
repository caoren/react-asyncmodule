/* eslint-disable */
import {
    isServer,
    isWebpack,
    getModule,
    requireById,
    syncModule,
    shallowCopy,
} from '../src/util';

describe('shallow copy', () => {
    test('normal', () => {
        const a = { a: 1 };
        const b = { b: 2 };
        expect(shallowCopy({}, a, b)).toEqual({
            a: 1, b: 2
        });
    });
    test('null', () => {
        expect(shallowCopy()).toBeUndefined();
    });
    test('no arg', () => {
        expect(shallowCopy({})).toEqual({});
    });
});

describe('util not webpack', () => {
    beforeAll(() => {
        global.__webpack_modules__ = {
            1: { a: 1 }
        }
    });
    afterAll(() => {
        delete global.__webpack_modules__;
    });
    test('isServer', () => {
        expect(isServer()).toBeFalsy();
    });
    test('isWebpack', () => {
        expect(isWebpack()).toBeFalsy();
    });
    test('getModule has default', () => {
        const tmod = {
            default: {a: 1},
            __esModule: true
        };
        expect(getModule(tmod)).toEqual({a: 1});
    });
    test('getModule has default', () => {
        const tmod = {b: 1};
        expect(getModule(tmod)).toEqual({b: 1});
    });
    test('requireById', () => {
        expect(requireById(1)).toBeNull();
    });
    test('syncModule', () => {
        const resolveWeak = () => 1;
        expect(syncModule(resolveWeak)).toBeNull();
    });
    test('syncModule', () => {
        expect(syncModule()).toBeNull();
    });
});

describe('util webpack', () => {
    beforeAll(() => {
        global.window = {
            document: {
                createElement: {}
            }
        };
        global.__webpack_require__ = () => {
            return { a: 1 };
        }
        global.__webpack_modules__ = {
            1: { a: 1 }
        }
    });
    afterAll(() => {
        delete global.window;
        delete global.__webpack_require__;
        delete global.__webpack_modules__;
    });
    test('isServer', () => {
        expect(isServer()).toBeFalsy();
    });
    test('isWebpack', () => {
        expect(isWebpack()).toBeTruthy();
    });
    test('syncModule exist', () => {
        const resolveWeak = () => 1;
        expect(syncModule(resolveWeak)).toEqual({ a: 1});
    });
    test('syncModule nothing', () => {
        const resolveWeak = () => 2;
        expect(syncModule(resolveWeak)).toEqual(null);
    });
});