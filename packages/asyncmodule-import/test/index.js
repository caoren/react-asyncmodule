import path from 'path';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import asyncModuleImport from '../lib/index';
var babel = require("babel-core");

describe('asyncmodule import', () => {
    it('rename names import', () => {
        const src = readFileSync(path.join(__dirname, 'cases/rename.js'), 'utf-8');
        const out = babel.transform(src, {
            plugins: ['syntax-dynamic-import',asyncModuleImport]
        });
        const expectStr = readFileSync(path.join(__dirname, 'cases/rename_res.js'), 'utf-8');
        expect(out.code).to.be.equal(expectStr);
    });
    it('not react-asyncmodule', () => {
        const src = readFileSync(path.join(__dirname, 'cases/somepackage.js'), 'utf-8');
        const out = babel.transform(src, {
            plugins: ['syntax-dynamic-import',asyncModuleImport]
        });
        const expectStr = readFileSync(path.join(__dirname, 'cases/somepackage.js'), 'utf-8');
        expect(out.code).to.be.equal(expectStr);
    });
    it('common async import', () => {
        const src = readFileSync(path.join(__dirname, 'cases/common.js'), 'utf-8');
        const out = babel.transform(src, {
            plugins: ['syntax-dynamic-import',asyncModuleImport]
        });
        const expectStr = readFileSync(path.join(__dirname, 'cases/common_res.js'), 'utf-8');
        expect(out.code).to.be.equal(expectStr);
    });

    it('css import', () => {
        const src = readFileSync(path.join(__dirname, 'cases/importCss.js'), 'utf-8');
        const out = babel.transform(src, {
            plugins: ['syntax-dynamic-import',[asyncModuleImport, {
                importCss: true
            }]]
        });
        const expectStr = readFileSync(path.join(__dirname, 'cases/importCss_res.js'), 'utf-8');
        expect(out.code).to.be.equal(expectStr);
    });
});