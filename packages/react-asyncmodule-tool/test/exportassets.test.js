import { exportAssets } from '../src/index';
import { createAssets } from '../src/index';

describe('exportAssets', () => {
    test('default', () => {
        const res = exportAssets();
        expect(res).toEqual({
            css: "",
            js: ""
        });
    });
    test('custom', () => {
        const assets = createAssets([{
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