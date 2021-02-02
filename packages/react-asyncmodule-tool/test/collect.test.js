import path from 'path';
import Collect, { createCollect, collectMap } from '../src/index';
import { clone } from '../src/helper';
import { stats, stats1, stats2, stats3, stats4, stats5, extraStats } from './statdata';


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
