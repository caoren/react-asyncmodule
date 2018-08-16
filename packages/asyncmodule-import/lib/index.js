'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref) {
  var t = _ref.types;
  var asyncModule = 'asyncModule',
      asyncComponent = 'asyncComponent';

  var addComments = function addComments(module) {
    var modulePath = module.value;
    var moduleName = modulePath.split('/')[modulePath.split('/').length - 1];
    if (!module.leadingComments) {
      module.leadingComments = [{
        type: "CommentBlock",
        value: 'webpackChunkName: "' + moduleName + '"'
      }];
    }
    return { modulePath: modulePath, moduleName: moduleName };
  };

  var buildLoad = function buildLoad(importPath, moduleName) {
    var importCss = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var loadMaterials = [importPath.node];

    if (importCss) {
      loadMaterials.push(t.callExpression(t.identifier('ImportCss'), [t.stringLiteral(moduleName)]));
    }
    return t.objectProperty(t.identifier('load'), t.arrowFunctionExpression([], t.callExpression(t.memberExpression(t.callExpression(t.memberExpression(t.identifier('Promise'), t.identifier('all')), [t.arrayExpression(loadMaterials)]), t.identifier('then')), [t.arrowFunctionExpression([t.identifier('jsprim')], t.memberExpression(t.identifier('jsprim'), t.NumericLiteral(0), true))])));
  };

  var buildResolveWeak = function buildResolveWeak(modulePath) {
    return t.objectProperty(t.identifier('resolveWeak'), t.arrowFunctionExpression([], t.callExpression(t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')), [t.stringLiteral(modulePath)])));
  };

  var buildChunkName = function buildChunkName(moduleName) {
    return t.objectProperty(t.identifier('chunk'), t.arrowFunctionExpression([], t.stringLiteral(moduleName)));
  };

  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref2) {
        var _ref2$opts = _ref2.opts,
            opts = _ref2$opts === undefined ? {} : _ref2$opts;
        var node = path.node;

        if (!node || node.specifiers.length === 0) {
          return;
        }
        var source = node.source;

        if (t.isStringLiteral(source, { value: 'react-asyncmodule' })) {
          asyncModule = node.specifiers[0].local.name;
        }
      },
      CallExpression: function CallExpression(path, _ref3) {
        var _ref3$opts = _ref3.opts,
            opts = _ref3$opts === undefined ? {} : _ref3$opts;
        var node = path.node;
        var importCss = opts.importCss;

        if (!node) {
          return;
        }
        if (t.isIdentifier(node.callee, { name: asyncModule })) {
          var calleeParent = path.parentPath.node;
          asyncComponent = calleeParent.id.name;
          var programPath = path.find(function (p) {
            return p.parentKey === 'body';
          });
          if (importCss && programPath) {
            var declaration = t.importDeclaration([t.importDefaultSpecifier(t.identifier('ImportCss'))], t.stringLiteral('babel-plugin-asyncmodule-import/lib/importcss'));
            programPath.insertBefore(declaration);
          }
        }
        if (t.isIdentifier(node.callee, { name: asyncComponent })) {
          // save the 1st arg import call
          var importPath = path.get('arguments.0');
          if (!importPath || !t.isImport(importPath.node.callee)) {
            return;
          }
          // add leadingComments to the import argument module

          var _importPath$node$argu = _slicedToArray(importPath.node.arguments, 1),
              module = _importPath$node$argu[0];

          var _addComments = addComments(module),
              modulePath = _addComments.modulePath,
              moduleName = _addComments.moduleName;

          var load = buildLoad(importPath, moduleName, importCss);
          var resolveWeak = buildResolveWeak(modulePath);
          var chunk = buildChunkName(moduleName);

          importPath.replaceWith(t.objectExpression([load, resolveWeak, chunk]));
        }
      }
    }
  };
};

;
module.exports = exports['default'];