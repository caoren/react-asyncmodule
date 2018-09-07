import {
    createAssetsHash,
    exportAssets
} from '../src/util';

describe('createAssetsHash', () => {
    test('default', () => {
        const assets = createAssetsHash();
        expect(assets).toEqual({
            js: {},
            css: {}
        });
    });
    test('chunks not contain `name` | `names`', () => {
        const assets = createAssetsHash([{
            files: ['a.css', 'a.js']
        }]);
        expect(assets).toEqual({
            js: {},
            css: {}
        });
    });
    test('custom', () => {
        const assets = createAssetsHash([{
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
        const assets = createAssetsHash([{
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
        const assets = createAssetsHash([{
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
describe('exportAssets', () => {
    test('default', () => {
        const res = exportAssets();
        expect(res).toEqual({
            css: "",
            js: ""
        });
    });
    test('custom', () => {
        const assets = createAssetsHash([{
            names: ['a'],
            files: ['a.css', 'a.js']
        }, {
            names: ['b'],
            files: ['b.css', 'b.js']
        }], '/public/');
        const name = ['a', 'b'];
        const res = exportAssets(assets, name);
        expect(res).toEqual({
            js: '<script type="text/javascript" src="/public/a.js"></script><script type="text/javascript" src="/public/b.js"></script>',
            css: '<link type="text/css" href="/public/a.css" rel="stylesheet"><link type="text/css" href="/public/b.css" rel="stylesheet">'
        });
    });
});