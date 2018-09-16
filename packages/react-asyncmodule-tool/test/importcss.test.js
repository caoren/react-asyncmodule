import { ImportCss } from '../src/index';

describe('__ASSETS_CHUNKS__ exist', () => {
    beforeAll(() => {
        window.__ASSETS_CHUNKS__ = {
            key: '/test/key.css'
        };
    });
    afterAll(() => {
        window.__ASSETS_CHUNKS__ = undefined;
    });
    test('output', () => {
        const res = ImportCss('key');
        expect(res).toBeInstanceOf(Promise);
    });
});
describe('__ASSETS_CHUNKS__ not exist', () => {
    beforeAll(() => {
        window.__ASSETS_CHUNKS__ = undefined;
    });
    test('output', () => {
        const res = ImportCss('key');
        expect(res).toBeInstanceOf(Promise);
    });
});
describe('emulate image', () => {
    beforeAll(() => {
        window.__ASSETS_CHUNKS__ = {
            key: 'error'
        };
        Object.defineProperty(global.Image.prototype, 'src', {
            set(src) {
                if (src === 'error') {
                    setTimeout(() => this.onerror(new Error('mocked error')));
                }
            }
        });
    });
    afterAll(() => {
        window.__ASSETS_CHUNKS__ = undefined;
    });
    test('result', () => {
        expect.assertions(1);
        const res = ImportCss('key');
        return res.then((data) => {
            expect(data).toBeUndefined();
        });
    });
});
describe('emulate link', () => {
    beforeAll(() => {
        window.__ASSETS_CHUNKS__ = {
            key: 'linkerror'
        };
        Object.defineProperty(global.HTMLLinkElement.prototype, 'href', {
            set(href) {
                if (href === 'linkerror') {
                    setTimeout(() => this.onerror(new Error('mocked error')));
                }
            }
        });
    });
    afterAll(() => {
        window.__ASSETS_CHUNKS__ = undefined;
    });
    test('result', () => {
        expect.assertions(1);
        const res = ImportCss('key');
        return res.catch((data) => {
            expect(data).toBeInstanceOf(Error);
        });
    });
});