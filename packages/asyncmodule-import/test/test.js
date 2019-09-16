import path from 'path';
import asyncModuleImport from '../src/index';
var babel = require("babel-core");

describe('asyncmodule import', function() {
    
    test('rename', function()  {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/rename.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/rename_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('common', function() {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/common.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/common_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('magicCmt', function() {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/magicCmt.js'), {
            plugins: ['syntax-dynamic-import',[asyncModuleImport, {
                importCss: true
            }]]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/magicCmt_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('defaultcomment', function() {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/defaultcomment.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/defaultcomment_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('arrowCall', function() {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/arrowCall.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/arrowCall_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('epmty', function() {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/empty.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/empty_res.js'));
        expect(srcCode).toBe(expectCode);
    });
    test('objectMethodCall', function() {
        const { code: srcCode } = babel.transformFileSync(path.join(__dirname, 'cases/objectMethod.js'), {
            plugins: ['syntax-dynamic-import', asyncModuleImport]
        });
        const { code: expectCode } = babel.transformFileSync(path.join(__dirname, 'cases/objectMethod_res.js'));
        expect(srcCode).toBe(expectCode);
    });
});