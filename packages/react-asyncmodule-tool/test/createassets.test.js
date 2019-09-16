import { createAssets } from '../src/index';


const stats = {
    entrypoints: {
        app: {
            chunks: ['commons', 'libs', 'app'],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: ['commons', 'libs', 'app'],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                'app.js.map'
            ]
        },
        a: {
            chunks: ['commons', 'default', 'a'],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'default.js',
                'default.js.map',
                'a.js',
                'a.js.map',
                'a.css',
                'a.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/'
}
describe('createAssets', () => {
    test('default', () => {
        const assets = createAssets();
        expect(assets).toEqual({
            "@ENTRY": {
                js: [],
                css: []
            }
        });
    });
    test('custom', () => {
        const assets = createAssets(stats);
        expect(assets).toEqual({
            "@ENTRY": {
                js: [
                    '//s.iplay.126.net/t/s/commons.js',
                    '//s.iplay.126.net/t/s/libs.js',
                    '//s.iplay.126.net/t/s/app.js',
                ],
                css: [ '//s.iplay.126.net/t/s/commons.css' ]
            },
            a: {
                js: [
                    '//s.iplay.126.net/t/s/default.js',
                    '//s.iplay.126.net/t/s/a.js'
                ],
                css: [
                    '//s.iplay.126.net/t/s/a.css'
                ]
            }
        });
    });
    test('assets not array', () => {
        const assets = createAssets({
            namedChunkGroups: {
                'a': {
                    assets: ''
                }
            }
        });
        expect(assets).toEqual({
            "@ENTRY": {
                js: [],
                css: []
            }
        });
    });
});