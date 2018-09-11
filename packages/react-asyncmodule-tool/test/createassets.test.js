import { createAssets } from '../src/index';

describe('createAssets', () => {
    test('default', () => {
        const assets = createAssets();
        expect(assets).toEqual({
            js: {},
            css: {}
        });
    });
    test('chunks not contain `name` | `names`', () => {
        const assets = createAssets([{
            files: ['a.css', 'a.js']
        }]);
        expect(assets).toEqual({
            js: {},
            css: {}
        });
    });
    test('custom', () => {
        const assets = createAssets([{
            name: 'a',
            files: ['a.css', 'a.js']
        }, {
            name: 'b',
            files: ['b.css', 'b.js']
        }], '/public/');
        expect(assets).toEqual({
            js: {
                a: '/public/a.js',
                b: '/public/b.js'
            },
            css: {
                a: '/public/a.css',
                b: '/public/b.css'
            }
        });
    });
    test('ignore', () => {
        const assets = createAssets([{
            name: 'a',
            files: ['a.css', 'a.js']
        }, {
            name: 'b',
            files: ['b.css', 'b.js']
        }, {
            name: 'c',
            files: ['c.js.map']
        }, {
            name: 'd',
            files: undefined
        }], '/public/');
        expect(assets).toEqual({
            js: {
                a: '/public/a.js',
                b: '/public/b.js'
            },
            css: {
                a: '/public/a.css',
                b: '/public/b.css'
            }
        });
    });
    test('stats param', () => {
        const assets = createAssets([{
            names: ['a'],
            files: ['a.css', 'a.js']
        }, {
            names: ['b'],
            files: ['b.css', 'b.js']
        }], '/public/');
        expect(assets).toEqual({
            js: {
                a: '/public/a.js',
                b: '/public/b.js'
            },
            css: {
                a: '/public/a.css',
                b: '/public/b.css'
            }
        });
    });
});