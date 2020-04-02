import {
    ENTRYKEY,
    strEndswith,
    filterJs,
    filterCss,
    mapScript,
    mapLink,
    mapStyle,
    uniq,
    joinPath
} from "../src/helper";

describe('ENTRYKEY', () => {
    test('default', () => {
        expect(ENTRYKEY).toBe('@ENTRY');
    });
});

describe('strEndswith', () => {
    test('default', () => {
        expect(strEndswith('abcsd.js', '.js')).toBeTruthy();
        expect(strEndswith('abcsd.js', '.css')).toBeFalsy();
        expect(strEndswith()).toBeTruthy();
    });
});

describe('filterJs', () => {
    test('default', () => {
        expect(filterJs('abcsd.js')).toBeTruthy();
        expect(filterJs('abcsd.css')).toBeFalsy();
    });
});

describe('filterCss', () => {
    test('default', () => {
        expect(filterCss('abcsd.css')).toBeTruthy();
        expect(filterCss('abcsd.js')).toBeFalsy();
    });
});

describe('mapScript', () => {
    test('default', () => {
        expect(mapScript('abcsd.js')).toBe('<script type="text/javascript" src="abcsd.js"></script>');
    });
    test('async', () => {
        expect(mapScript('abcsd.js', true)).toBe('<script type="text/javascript" async src="abcsd.js"></script>');
    });
});

describe('mapLink', () => {
    test('default', () => {
        expect(mapLink('abcsd.css')).toBe('<link href="abcsd.css" rel="stylesheet">');
    });
});

describe('mapStyle', () => {
    test('default', () => {
        expect(mapStyle('.test{color: #000}', '/a.css')).toBe('<style data-href="/a.css" type="text/css">.test{color: #000}</style>');
    });
});

describe('uniq', () => {
    test('default', () => {
        const arr = ['chunk', 'chunk1', 'chunk1'];
        expect(uniq(arr)).toEqual(['chunk', 'chunk1']);
    });
});

describe('joinPath', () => {
    test('default', () => {
        expect(joinPath('/a/b', 'c.js')).toBe('/a/b/c.js');
    });

    test('gap', () => {
        expect(joinPath('/a/b/', 'c.js')).toBe('/a/b/c.js');
    });
});