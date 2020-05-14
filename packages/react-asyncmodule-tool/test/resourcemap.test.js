import path from 'path';
import { collectMap, ResourceMap } from '../src/index';

const outputPath = path.resolve(__dirname, './css/');
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
    outputPath: outputPath
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
                'c.css',
                'c.css.map'
            ]
        }
    },
    publicPath: '//s.iplay.126.net/t/s/',
    outputPath: outputPath
}

describe('collectMap', () => {
    test('default', () => {
        return collectMap.prefetchCss({
            stats
        }).then((res) => {
            expect(res).toEqual({
                [`${outputPath}/a.css`]: '.a{color: #000}',
                [`${outputPath}/commons.css`]: '.common{color: #f00}'
            });
        });
    });

    test('err', () => {
        return collectMap.prefetchCss({
            stats: stats1
        }).then((res) => {
            expect(res).toEqual({
                [`${outputPath}/a.css`]: '.a{color: #000}',
                [`${outputPath}/commons.css`]: '.common{color: #f00}'
            });
        }).catch((err) => {
            expect(err.message).toMatch('no such file or directory');
        });
    });
});

describe('ResourceMap', () => {
    test('default', () => {
        const res = new ResourceMap({
            stats
        });
        expect(res.getStyle()).toEqual([
            `${outputPath}/commons.css`,
            `${outputPath}/a.css`
        ]);
        expect(res.getScript()).toEqual([
            `${outputPath}/commons.js`,
            `${outputPath}/libs.js`,
            `${outputPath}/app.js`,
            `${outputPath}/default.js`,
            `${outputPath}/a.js`
        ]);
    });

    test('empty', () => {
        expect(() => {
            new ResourceMap();
        }).toThrow();
    });
});
