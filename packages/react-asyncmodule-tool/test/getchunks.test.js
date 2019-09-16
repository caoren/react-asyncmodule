import { getChunkAssets } from '../src/index';

describe('getChunkAssets', () => {
    test('default', () => {
        const res = getChunkAssets();
        expect(res).toEqual({
            js: "",
            css: ""
        });
    });
    test('custom', () => {
        expect(getChunkAssets({
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
        }, 'a')).toEqual({
            js: '<script type="text/javascript" src="//s.iplay.126.net/t/s/default.js"></script><script type="text/javascript" src="//s.iplay.126.net/t/s/a.js"></script><script type="text/javascript" src="//s.iplay.126.net/t/s/commons.js"></script><script type="text/javascript" src="//s.iplay.126.net/t/s/libs.js"></script><script type="text/javascript" src="//s.iplay.126.net/t/s/app.js"></script>',
            css: '<link href="//s.iplay.126.net/t/s/commons.css" rel="stylesheet"><link href="//s.iplay.126.net/t/s/a.css" rel="stylesheet">'
        });
    });
});