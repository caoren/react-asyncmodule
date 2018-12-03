import path from 'path';
import asyncModuleImport from '../src/index';
var babel = require("babel-core");

describe('asyncmodule import', () => {
    test('rename', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/rename.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/rename_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('common', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/common.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/common_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('importCss', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/importCss.js'), {
            plugins: ['syntax-dynamic-import',[asyncModuleImport, {
                importCss: true
            }]]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/importCss_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('defaultcomment', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/defaultcomment.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/defaultcomment_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('arrowCall', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/arrowCall.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/arrowCall_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('simplifyImportCss', () => {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/simplifyImportCss.js'), {
            plugins: ['syntax-dynamic-import', [asyncModuleImport, {
                importCss: true
            }]]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/simplifyImportCss_res.js'));
        expect(srcCode).toBe(expectCode);
    });
});