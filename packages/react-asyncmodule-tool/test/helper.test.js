import { ENTRYKEY, strEndswith, filterJs, filterCss, mapScript, mapLink } from "../src/helper";

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
});

describe('mapLink', () => {
    test('default', () => {
        expect(mapLink('abcsd.css')).toBe('<link href="abcsd.css" rel="stylesheet">');
    });
});