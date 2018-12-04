'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref) {
    var t = _ref.types;

    var addComments = function addComments(module) {
        var modulePath = module.value;
        var moduleName = modulePath.split('/')[modulePath.split('/').length - 1];
        if (!module.leadingComments) {
            module.leadingComments = [{
                type: "CommentBlock",
                value: 'webpackChunkName: "' + moduleName + '"'
            }];
        }
        return {
            modulePath: modulePath,
            moduleName: moduleName
        };
    };

    var buildLoad = function buildLoad(importPath, moduleName, importCss) {
        var loadMaterials = [importPath.node];

        if (importCss) {
            loadMaterials.push(t.callExpression(t.identifier('ImportCss'), [t.stringLiteral(moduleName)]));
        }
        return t.objectProperty(t.identifier('load'), t.arrowFunctionExpression([], t.callExpression(t.memberExpression(t.callExpression(t.memberExpression(t.identifier('Promise'), t.identifier('all')), [t.arrayExpression(loadMaterials)]), t.identifier('then')), [t.arrowFunctionExpression([t.identifier('jsprim')], t.memberExpression(t.identifier('jsprim'), t.NumericLiteral(0), true))])));
    };

    var buildResolveWeak = function buildResolveWeak(modulePath) {
        return t.objectProperty(t.identifier('resolveWeak'), t.arrowFunctionExpression([], t.callExpression(t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')), [t.stringLiteral(modulePath)])));
    };

    var buildChunkName = function buildChunkName(chunkNameCmt) {
        return t.objectProperty(t.identifier('chunk'), t.arrowFunctionExpression([], t.stringLiteral(chunkNameCmt.value.split('"')[1])));
    };
    var getProgramPath = function getProgramPath(path) {
        return path.find(function (p) {
            return t.isProgram(p.node);
        });
    };

    var handleImportCss = function handleImportCss(path, importCss) {
        if (importCss) {
            var declaration = t.importDeclaration([t.importDefaultSpecifier(t.identifier('ImportCss'))], t.stringLiteral('react-asyncmodule-tool/dist/importcss'));
            var programPath = getProgramPath(path);
            if (!programPath.scope.existedImportCss) {
                programPath.unshiftContainer('body', declaration);
                programPath.scope.existedImportCss = true;
            }
        }
    };

    var astParser = function astParser(path, importCss) {
        var returnImport = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        handleImportCss(path, importCss);
        // add leadingComments to the import argument module
        var nodeType = path.node.type;

        var importPath = '';
        var module = '';
        if (nodeType === 'CallExpression') {
            importPath = path.get('arguments.0');
        }
        if (nodeType === 'ObjectProperty') {
            importPath = returnImport ? path.get('value.body') : path.get('value.body.body.0.expression');
        }
        if (nodeType === 'ObjectMethod') {
            importPath = returnImport ? path.get('body.body.0.argument') : path.get('body.body.0.expression');
        }

        var _importPath$node$argu = _slicedToArray(importPath.node.arguments, 1);

        module = _importPath$node$argu[0];

        var _addComments = addComments(module),
            modulePath = _addComments.modulePath,
            moduleName = _addComments.moduleName;

        var load = buildLoad(importPath, moduleName, importCss);
        var resolveWeak = buildResolveWeak(modulePath);
        var chunkNameCmt = module.leadingComments.find(function (cmt) {
            return cmt.value.includes('webpackChunkName');
        });
        var chunk = buildChunkName(chunkNameCmt);
        if (nodeType === 'CallExpression') {
            importPath.replaceWith(t.objectExpression([load, resolveWeak, chunk]));
        }
        if (nodeType === 'ObjectProperty') {
            var more = path.parent.properties.splice(1);
            var nmore = more.map(function (property, index) {
                return t.objectProperty(property.key, property.value);
            });
            path.replaceWithMultiple([load, resolveWeak, chunk].concat(nmore));
        }
        if (nodeType === 'ObjectMethod') {
            var _more = path.parent.properties.splice(1);
            var _nmore = _more.map(function (property, index) {
                return t.objectProperty(property.key, property.value);
            });
            path.replaceWithMultiple([load, resolveWeak, chunk].concat(_nmore));
        }
    };
    return {
        visitor: {
            ImportDeclaration: function ImportDeclaration(path) {
                var node = path.node;

                var programPath = getProgramPath(path);
                if (node.specifiers.length && node.specifiers[0].local.name === 'ImportCss') {
                    programPath.scope.existedImportCss = true;
                }
            },
            CallExpression: function CallExpression(path, _ref2) {
                var opts = _ref2.opts;
                var node = path.node;

                var importCss = opts && opts.importCss || false;

                if (t.isCallExpression(node.arguments[0]) && t.isImport(node.arguments[0].callee)) {
                    astParser(path, importCss);
                }
            },
            ObjectProperty: function ObjectProperty(path, _ref3) {
                var opts = _ref3.opts;
                var node = path.node;

                var importCss = opts && opts.importCss || false;
                var returnImport = undefined;
                if (node.key.name === 'load' && t.isArrowFunctionExpression(node.value)) {
                    if (node.value.body && t.isImport(node.value.body.callee)) {
                        returnImport = true;
                    } else if (node.value.body.body && t.isImport(node.value.body.body[0].expression.callee)) {
                        returnImport = false;
                    }
                    if (returnImport !== undefined) {
                        astParser(path, importCss, returnImport);
                    }
                }
            },
            ObjectMethod: function ObjectMethod(path, _ref4) {
                var opts = _ref4.opts;
                var node = path.node;

                var importCss = opts && opts.importCss || false;
                var returnImport = undefined;
                if (node.key.name === 'load' && t.isBlockStatement(node.body)) {
                    if (t.isExpressionStatement(node.body.body[0]) && t.isImport(node.body.body[0].expression.callee)) {
                        returnImport = false;
                    } else if (t.isReturnStatement(node.body.body[0]) && t.isImport(node.body.body[0].argument.callee)) {
                        returnImport = true;
                    } else {
                        return;
                    }
                    astParser(path, importCss, returnImport);
                } else {
                    return;
                }
            }
        }
    };
};

;
module.exports = exports['default'];