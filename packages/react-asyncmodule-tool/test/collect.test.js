import path from 'path';
import Collect, { createCollect, collectMap } from '../src/index';
import { clone } from '../src/helper';

const stats = {
    entrypoints: {
        app: {
            chunks: ['runtime', 'commons', 'libs', 'app'],
            assets: [
                "runtime.js",
                "runtime.js.map",
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                "app.f9ee3a13182e32a778b2.hot-update.js",
                "app.js.map",
                "app.f9ee3a13182e32a778b2.hot-update.js.map"
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: ['runtime', 'commons', 'libs', 'app'],
            assets: [
                "runtime.js",
                "runtime.js.map",
                'commons.css',
                'commons.js',
                'commons.css.map',
                'commons.js.map',
                'libs.js',
                'libs.js.map',
                'app.js',
                "app.f9ee3a13182e32a778b2.hot-update.js",
                "app.js.map",
                "app.f9ee3a13182e32a778b2.hot-update.js.map"
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
    chunks: [
        {
            "id": "a",
            "rendered": false,
            "initial": false,
            "entry": false,
            "size": 32905,
            "names": [
                "a"
            ],
            "files": [
                'a.js',
                'a.js.map',
                'a.css',
                'a.css.map'
            ],
            "parents": [
                "app",
                "libs",
                "runtime"
            ]
        },
        {
            "id": "app",
            "rendered": true,
            "initial": true,
            "entry": false,
            "size": 1935551,
            "names": [
                "app"
            ],
            "files": [
                "app.js",
                "app.f9ee3a13182e32a778b2.hot-update.js",
                "app.js.map",
                "app.f9ee3a13182e32a778b2.hot-update.js.map"
            ],
            "hash": "085e9062268b5a89639a",
            "siblings": [
                "libs",
                "runtime"
            ],
            "parents": []
        },
        {
            "id": "runtime",
            "rendered": true,
            "initial": true,
            "entry": true,
            "size": 0,
            "names": [
                "runtime"
            ],
            "files": [
                "runtime.js",
                "runtime.js.map"
            ],
            "hash": "920d427e5afcdda9222b",
            "siblings": [
                "app",
                "libs"
            ],
            "parents": []
        },
        {
            "id": "libs",
            "rendered": false,
            "initial": true,
            "entry": false,
            "reason": "split chunk (cache group: libs) (name: libs)",
            "size": 1833271,
            "names": [
                "libs"
            ],
            "files": [
                "libs.js",
                "libs.js.map"
            ],
            "hash": "35a71a4d80f71abe06b6",
            "parents": [
                "app",
                "libs",
                "runtime"
            ]
        }
    ],
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

    test('getInlineStyles no exist', () => {
        const statsclone = clone(stats);
        statsclone.namedChunkGroups['a'].assets[8] = 'aaa.css';
        const res = createCollect({
            stats: statsclone,
            chunkName: 'a'
        });
        return res.getInlineStyles().catch((e) => {
            expect(e.message).toMatch(/ENOENT/);
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

const stats4 = {
    chunks: [
        {
            "files": [
                "b.css",
                "b.js"
            ],
            id: 0,
            "parents": [
                2
            ]
        },
        {
            "files": [
                "app.css",
                "app.js"
            ],
            id: 1,
            "parents": []
        },
        {
            "files": [
                "common.css",
                "common.js"
            ],
            id: 2,
            "parents": [1]
        }
    ],
    entrypoints: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        },
        b: {
            chunks: [0],
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
describe('has parent', () => {
    test('default', () => {
        const res = createCollect({
            stats: stats4,
            chunkName: 'b'
        });
        expect(res.getScripts()).toBe('<script id="__ASYNC_MODULE_CHUNKS__" type="application/json">[2,0]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/common.js"></script><script type="text/javascript" async src="//s.iplay.126.net/t/s/b.js"></script>');
        expect(res.getStyles()).toBe('<link href="//s.iplay.126.net/t/s/common.css" rel="stylesheet"><link href="//s.iplay.126.net/t/s/b.css" rel="stylesheet">');
    });
});

const stats5 = {
    remotesMap: {
        "b": [
            {
                "shareScope": "default",
                "name": "./Sign",
                "externalModuleId": "webpack/container/reference/look_common"
            }
        ]
    },
    chunks: [
        {
            "files": [
                "b.css",
                "b.js"
            ],
            id: 0,
            "parents": [
                2
            ]
        },
        {
            "files": [
                "app.css",
                "app.js"
            ],
            id: 1,
            "parents": []
        },
        {
            "files": [
                "commons.css",
                "common.js"
            ],
            id: 2,
            "parents": [1]
        }
    ],
    entrypoints: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        }
    },
    namedChunkGroups: {
        app: {
            chunks: [1],
            assets: [
                'app.js',
                'app.js.map'
            ]
        },
        b: {
            chunks: [0],
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
const extraStats = {
    publicPath: '//s2.iplay.126.net/livemobile/s/',
    exposesMap: {
        "./Sign": [
            1
        ]
    },
    chunks: [
        {
            "files": [
                "b.css",
                "b.js"
            ],
            id: 0,
            "parents": [
                2
            ]
        },
        {
            "files": [
                "actdetail.f2b9cd10.css", // look h5 的线上 cdn 地址
                "sign.js"
            ],
            id: 1
        }
    ]
}

// 测试 federation
describe('federation', () => {
    test('default', () => {
        const res = createCollect({
            stats: stats5,
            chunkName: 'b',
            isFederation: true
        });
        expect(res.getScripts()).toBe('<script id="__ASYNC_MODULE_NAMES__" type="application/json">["b"]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script>');
        expect(res.getStyles()).toBe('<link href="//s.iplay.126.net/t/s/commons.css" rel="stylesheet"><link href="//s.iplay.126.net/t/s/b.css" rel="stylesheet">');
    });

    test('extraStats', (done) => {
        expect.assertions(3);
        const res = createCollect({
            stats: stats5,
            chunkName: 'b',
            isFederation: true,
            extraStats: extraStats
        });
        expect(res.getScripts()).toBe('<script id="__ASYNC_MODULE_NAMES__" type="application/json">["b"]</script><script type="text/javascript" async src="//s.iplay.126.net/t/s/app.js"></script>');
        expect(res.getStyles()).toBe('<link href="//s.iplay.126.net/t/s/commons.css" rel="stylesheet"><link href="//s.iplay.126.net/t/s/b.css" rel="stylesheet"><link href="//s2.iplay.126.net/livemobile/s/actdetail.f2b9cd10.css" rel="stylesheet">');
        res.getInlineStyles().then((res) => {
            expect(res).toBe('<style data-href="//s.iplay.126.net/t/s/commons.css" type="text/css">.common{color: #f00}</style><style data-href="//s.iplay.126.net/t/s/b.css" type="text/css">.b{color: #000}</style><style data-href="//s2.iplay.126.net/livemobile/s/actdetail.f2b9cd10.css" type="text/css">.m-menu{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:52px;padding:0 20px;color:#666;font-size:15px}.m-menu:after{border-color:rgba(0,0,0,.1)}.m-menu a,.m-menu a:visited{color:#666}.m-menu_tm{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin-right:20px;border-top:3px solid transparent;border-bottom:3px solid transparent}.m-menu_tm:last-child{margin-right:0}.m-menu_chg{z-index:3}.m-menu a.z-sel,.m-menu div.z-sel{color:#ff2c55;border-bottom:3px solid #ff2c55}.m-menu-black,.m-menu-black a,.m-menu-black a:visited{color:hsla(0,0%,100%,.5)}.m-menu-black .z-sel{color:#fff;border-bottom-color:#fff}.m-menu-black:after{border-color:hsla(0,0%,100%,.12)}.m-actdt_wrp{padding:15px}.m-actdt_tl{padding-top:4px;font-size:24px;line-height:30px}.m-actdt_date{font-size:12px;margin:15px 0 20px;color:#999}.m-actdt_cont{font-size:16px;color:#444;line-height:24px}.m-actdt_cont a,.m-actdt_cont a:visited{color:#507daf}.m-actdt_cont p{margin:15px auto}.m-actdt_cont img{display:block;margin:15px 0;vertical-align:middle;max-width:100%!important;height:auto}</style>');
            done();
        }).catch((e) => {
            console.log('=e=', e);
            // expect(e).toThrow();
            done();
        });
    });

    test('stats css no exist', () => {
        expect.assertions(1);
        const stats51 = clone(stats5);
        // 换个不存在的 css
        stats51.namedChunkGroups['b'].assets[2] = 'c.css';
        const res = createCollect({
            stats: stats51,
            chunkName: 'b',
            isFederation: true,
            extraStats: extraStats
        });
        return res.getInlineStyles().catch((e) => {
            expect(e.message).toMatch(/ENOENT/);
        })
    });

    test('extraStats css no exist', () => {
        expect.assertions(1);
        const extraStats1 = clone(extraStats);
        // 换个不存在的 css
        extraStats1.chunks[1].files[0] = 'actdetail.ssss.css';
        const res = createCollect({
            stats: stats5,
            chunkName: 'b',
            isFederation: true,
            extraStats: extraStats1
        });
        return res.getInlineStyles().catch((e) => {
            expect(e.message).toBe('request failed');
        })
    });
});
