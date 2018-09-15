import path from 'path';
import asyncModuleImport from '../src/index';
var babel = require("babel-core");

describe('asyncmodule import', () => {
    test('rename names import', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/rename.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/rename_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('rename names import', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/common.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/common_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('rename names import', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/importCss.js'), {
            plugins: ['syntax-dynamic-import',[asyncModuleImport, {
                importCss: true
            }]]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/importCss_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('rename names import', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/defaultcomment.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/defaultcomment_res.js'));
        expect(srcCode).toBe(expectCode);
    });
});