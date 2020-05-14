import path from 'path';
import Collect, { createCollect, collectMap } from '../src/index';

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
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}

const stats1 = {
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
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './acss/')  // 不存在
}

const stats2 = {
    entrypoints: {
        app: {
            chunks: ['app'],
            assets: [
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: ['app'],
            assets: [
                'app.js',
                'app.js.map'
            ]
        },
        b: {
            chunks: ['b'],
            assets: [
                'b.js',
                'b.js.map',
                'b.css',
                'b.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}
describe('createCollect', () => {
    test('default', () => {
        const res = createCollect({
            stats,
            chunkName: 'a'
        });
        expect(res.getScripts()).toBe('<script id="__ASYNC_MODULE_CHUNKS__" type="application/json">["commons","libs","default","a"]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/commons.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/libs.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/default.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/a.js"></script>');
        expect(res.getStyles()).toBe('<link href="//s.iplay.126.net/t/s/commons.css" rel="stylesheet"><link href="//s.iplay.126.net/t/s/a.css" rel="stylesheet">');
    });

    test('chunkName empty', () => {
        const res = new Collect({ stats });
        expect(res.getScripts()).toBe('<script id="__ASYNC_MODULE_CHUNKS__" type="application/json">["commons","libs"]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/commons.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/libs.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script>');
        expect(res.getStyles()).toBe('<link href="//s.iplay.126.net/t/s/commons.css" rel="stylesheet">');
    });

    test('getInlineStyles default', () => {
        const res = createCollect({
            stats,
            chunkName: 'a'
        });
        return res.getInlineStyles().then((res) => {
            expect(res).toBe('<style data-href="//s.iplay.126.net/t/s/commons.css" type="text/css">.common{color: #f00}</style><style data-href="//s.iplay.126.net/t/s/a.css" type="text/css">.a{color: #000}</style>');
        });
    });

    test('custom outputpath', () => {
        const res = createCollect({
            stats: stats1,
            chunkName: 'a',
            outputPath: './test/css'
        });
        return res.getInlineStyles().then((res) => {
            expect(res).toBe('<style data-href="//s.iplay.126.net/t/s/commons.css" type="text/css">.common{color: #f00}</style><style data-href="//s.iplay.126.net/t/s/a.css" type="text/css">.a{color: #000}</style>');
        });
    });

    test('empty params', () => {
        expect(() => {
            const res = new Collect();
        }).toThrow();
    });

    test('getInlineStyles err', () => {
        const res = createCollect({
            stats: stats2,
            chunkName: ['b'],
            entrypoints: ['app']
        });
        return res.getInlineStyles().then((res) => {
            // console.log(res);
        }).catch((err) => {
            expect(err.message).toMatch(/\/b.css/);
        });
    });
});

const stats3 = {
    entrypoints: {
        app: {
            chunks: [1, 3 , 2],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'runtimea.js',
                'runtimea.js.map',
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: [1, 3, 2],
            assets: [
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'runtimea.js',
                'runtimea.js.map',
                'app.js',
                'app.js.map'
            ]
        },
        a: {
            chunks: [1, 4, 5],
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
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: path.resolve(__dirname, './css/')
}
describe('runtimeName', () => {
    test('change', () => {
        const res = createCollect({
            stats: stats3,
            chunkName: 'a',
            runtimeName: 'runtimea'
        });
        expect(res.getScripts()).toBe('<script id="__ASYNC_MODULE_CHUNKS__" type="application/json">[1,4,5]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/commons.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/default.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/a.js"></script>');
    });

    test('change', () => {
        const res = createCollect({
            stats: stats3,
            chunkName: 'a',
            runtimeName: ['runtimea']
        });
        expect(res.getScripts({ hasRuntime: true })).toBe('<script id="__ASYNC_MODULE_CHUNKS__" type="application/json">[1,4,5]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/commons.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/runtimea.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/default.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/a.js"></script>');
    });
});

describe('getInlineStyles', () => {
    test('change', () => {
        return collectMap.prefetchCss({
            stats: stats3,
        }).then(() => {
            const res = createCollect({
                stats: stats3,
                chunkName: 'a'
            });
            return expect(res.getInlineStyles()).toBe('<style data-href="//s.iplay.126.net/t/s/commons.css" type="text/css">.common{color: #f00}</style><style data-href="//s.iplay.126.net/t/s/a.css" type="text/css">.a{color: #000}</style>');
        });
    });
});