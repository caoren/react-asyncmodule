import path from 'path';
import fs from 'fs';
import InlineAssetsChunks from '../src/index';

const defaultOptions = {
    name: 'webpackInlineAssetsChunks',
    inject: 'body',
    output: ''
};
const customOptions = Object.assign({}, defaultOptions, {
    inject: 'head'
});
describe('InlineAssets options', () => {
    test('default options', () => {
        const plugin = new InlineAssetsChunks();
        expect(plugin.options).toEqual(defaultOptions);
    });
    test('custom options', () => {
        const plugin = new InlineAssetsChunks({
            inject: 'head'
        });
        expect(plugin.options).toEqual(customOptions);
    });
});
describe('apply v4', () => {
    const compiler = {
        hooks: {
            compilation: {
                tap: jest.fn(),
            },
        }
    };
    test('compiler hook compilation', () => {
        const plugin = new InlineAssetsChunks();
        plugin.apply(compiler);
        expect(compiler.hooks.compilation.tap).toBeCalledWith('AssetsChunksHtmlWebpackPlugin', expect.any(Function));
    });
    describe('compilation hook', () => {
        let compilation = {
            hooks: {
                htmlWebpackPluginBeforeHtmlProcessing: {
                    tapAsync: jest.fn(),
                },
                htmlWebpackPluginAlterAssetTags: {
                    tapAsync: jest.fn(),
                },
            },
        };
        beforeEach(() => {
            compilation = {
                hooks: {
                    htmlWebpackPluginBeforeHtmlProcessing: {
                        tapAsync: jest.fn(),
                    },
                    htmlWebpackPluginAlterAssetTags: {
                        tapAsync: jest.fn(),
                    }
                }
            };
            compiler.hooks.compilation.tap.mockImplementation((hookName, callback) => callback(compilation));
        });

        test('attaches async hook to htmlWebpackPluginBeforeHtmlProcessing', () => {
            const plugin = new InlineAssetsChunks();
            plugin.apply(compiler);
            expect(compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync).toBeCalledWith(
                'html-webpack-plugin-before-html-generation',
                expect.any(Function)
            );
        });
        describe('htmlWebpackPluginBeforeHtmlProcessing hook', () => {
            let htmlPluginData;
            let hookCallback = jest.fn();

            beforeEach(() => {
                htmlPluginData = {
                    assets: {},
                };

                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync.mockImplementation((mockName, callback) =>
                    callback(htmlPluginData, hookCallback)
                );
            });

            describe('assetsHash', () => {
                test('calls callback with `htmlPluginData`', () => {
                    compilation.outputOptions = {
                        publicPath: '/public/'
                    };
                    compilation.chunks = [{
                        name: 'a',
                        files: ['a.css', 'a.js'],
                    }];
                    const plugin = new InlineAssetsChunks();
                    plugin.apply(compiler);

                    expect(hookCallback).toBeCalledWith(null, htmlPluginData);
                });
            });

            describe('inject', () => {
                const assetsHookCallback = jest.fn();
                beforeEach(() => {
                    compilation.outputOptions = {
                        publicPath: ''
                    };
                    compilation.chunks = [{
                        name: 'a',
                        files: ['a.css', 'a.js']
                    }, {
                        name: 'b',
                        files: ['b.css', 'b.js']
                    }, {
                        name: 'c',
                        files: ['c.css', 'c.js']
                    }];
                    htmlPluginData.head = [1, 2];
                    htmlPluginData.body = [1, 2];

                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync.mockImplementation((mockName, callback) =>
                        callback(htmlPluginData, assetsHookCallback)
                    );
                });
                test('htmlWebpackPluginAlterAssetTags', () => {
                    const plugin = new InlineAssetsChunks({
                        inject: 'head'
                    });
                    plugin.apply(compiler);

                    expect(compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync).toBeCalledWith(
                        'html-webpack-plugin-alter-asset-tags',
                        expect.any(Function)
                    );
                });
                test('inject head', () => {
                    const plugin = new InlineAssetsChunks({
                        inject: 'head'
                    });
                    plugin.apply(compiler);

                    expect(htmlPluginData.head[htmlPluginData.head.length - 1]).toEqual({
                        attributes: {
                            type: 'text/javascript'
                        },
                        closeTag: true,
                        innerHTML: 'window.__ASSETS_CHUNKS__ = {"a":"a.css","b":"b.css","c":"c.css"}',
                        tagName: 'script'
                    });
                });
                test('inject body', () => {
                    const plugin = new InlineAssetsChunks({
                        inject: 'body'
                    });
                    plugin.apply(compiler);

                    expect(htmlPluginData.body[0]).toEqual({
                        attributes: {
                            type: 'text/javascript'
                        },
                        closeTag: true,
                        innerHTML: 'window.__ASSETS_CHUNKS__ = {"a":"a.css","b":"b.css","c":"c.css"}',
                        tagName: 'script'
                    });
                });
                test('callback htmlPluginData', () => {
                    const plugin = new InlineAssetsChunks({
                        inject: 'body'
                    });
                    plugin.apply(compiler);
                    expect(assetsHookCallback).toBeCalledWith(null, htmlPluginData);
                });
                test('output json', (done) => {
                    expect.assertions(1);
                    const plugin = new InlineAssetsChunks({
                        output: path.resolve(__dirname, './cases/stats.json')
                    });
                    plugin.apply(compiler);
                    fs.readFile(path.resolve(__dirname, './cases/stats.json'), 'utf8', (err, data) => {
                        if (err) {
                            throw err;
                        }
                        const res = JSON.stringify({js: {
                                a: "a.js",
                                b: "b.js",
                                c: "c.js"
                            },
                            css: {
                                a: "a.css",
                                b: "b.css",
                                c: "c.css"
                            }}, null, 2);
                        expect(data).toBe(res);
                        done();
                    });
                });
            });
        });
    });
});
// before v4
describe('apply v3', () => {
    const compiler = {
        plugin: jest.fn()
    };
    test('compiler plugin', () => {
        const plugin = new InlineAssetsChunks();
        plugin.apply(compiler);
        expect(compiler.plugin).toBeCalledWith('compilation', expect.any(Function));
    });
    describe('compilation', () => {
        let compilation = {
            plugin: jest.fn()
        };
        beforeEach(() => {
            compilation = {
                plugin: jest.fn()
            };
            compiler.plugin.mockImplementation((hookName, callback) => callback(compilation));
        });

        test('compilation plugin', () => {
            const plugin = new InlineAssetsChunks();
            plugin.apply(compiler);
            expect(compilation.plugin).toBeCalledWith(
                'html-webpack-plugin-before-html-generation',
                expect.any(Function)
            );
        });

        describe('call compilation plugin', () => {
            let htmlPluginData;
            let hookCallback = jest.fn();
            beforeEach(() => {
                htmlPluginData = {
                    assets: {}
                };
                compilation.plugin.mockImplementation((mockName, callback) =>
                    callback(htmlPluginData, hookCallback)
                );
            });
            test('assetsHash', () => {
                compilation.outputOptions = {
                    publicPath: '/public/'
                };
                compilation.chunks = [{
                    name: 'a',
                    files: ['a.css', 'a.js'],
                }];
                const plugin = new InlineAssetsChunks();
                plugin.apply(compiler);

                expect(hookCallback).toBeCalledWith(null, htmlPluginData);
                const { assets } = htmlPluginData;
                const { assetsHash } = assets;
                expect(assetsHash).toEqual({
                    js: {
                        a: '/public/a.js'
                    },
                    css: {
                        a: '/public/a.css'
                    }
                });
            });
        });
    });
});