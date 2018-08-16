export default function (_ref) {
  let t = _ref.types;
  let asyncModule = 'asyncModule', asyncComponent = 'asyncComponent';

  const addComments = module =>{
    const modulePath = module.value;
    const moduleName = modulePath.split('/')[modulePath.split('/').length-1]; 
    if (!module.leadingComments) {
      module.leadingComments = [{
        type: "CommentBlock",
        value: `webpackChunkName: "${moduleName}"`
      }];
    }
    return { modulePath, moduleName };
  };

  const buildLoad = (importPath, moduleName, importCss = false)=> {
    let loadMaterials = [importPath.node];

    if (importCss) {
      loadMaterials.push(t.callExpression(t.identifier('ImportCss'),[t.stringLiteral(moduleName)]) )
    }
    return t.objectProperty(
      t.identifier('load'),
      t.arrowFunctionExpression(
        [],
        t.callExpression(
          t.memberExpression(
            t.callExpression(
              t.memberExpression(t.identifier('Promise'), t.identifier('all')), 
              [
                t.arrayExpression(loadMaterials)
              ] 
            ), 
            t.identifier('then'), 
          ),
          [
            t.arrowFunctionExpression(
              [t.identifier('jsprim')],
              t.memberExpression(t.identifier('jsprim'), t.NumericLiteral(0), true),
            )
          ]
        ),
      )
    )
  };

  const buildResolveWeak = (modulePath)=>(
    t.objectProperty(
      t.identifier('resolveWeak'),
      t.arrowFunctionExpression(
        [],
        t.callExpression(
          t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')),
          [t.stringLiteral(modulePath)]
        ),
      )
    )
  );

  const buildChunkName = (moduleName) => (
    t.objectProperty(
       t.identifier('chunk'),
       t.arrowFunctionExpression(
         [],
         t.stringLiteral(moduleName),
       )
    )
  )

  return {
    visitor: {
      ImportDeclaration(path, {opts = {}}) {
        const { node } = path;
        if (!node || node.specifiers.length === 0) {
          return;
        }
        const { source } = node;
        if (t.isStringLiteral(source, {value: 'react-asyncmodule'})) {
          asyncModule = node.specifiers[0].local.name;
        }
      },
      CallExpression(path, {opts = {}}) {
        const { node } = path;
        const { importCss } = opts;
        if (!node) {
          return;
        }
        if (t.isIdentifier(node.callee, {name: asyncModule})) {
          const calleeParent = path.parentPath.node;
          asyncComponent = calleeParent.id.name;
          const programPath = path.find((p) => {
              return p.parentKey === 'body';
          });
          if (importCss && programPath) {
            const declaration = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('ImportCss'))],
              t.stringLiteral('babel-plugin-asyncmodule-import/lib/importcss')
            );
            programPath.insertBefore(declaration);
          }
        }
        if (t.isIdentifier(node.callee, {name: asyncComponent})) {
          // save the 1st arg import call
          const importPath = path.get('arguments.0');
          if (!importPath || !t.isImport(importPath.node.callee)) {
            return;
          }
          // add leadingComments to the import argument module
          const [module] = importPath.node.arguments;
          const { modulePath, moduleName } = addComments(module);

          const load = buildLoad(importPath, moduleName, importCss);
          const resolveWeak = buildResolveWeak(modulePath);
          const chunk = buildChunkName(moduleName);

          importPath.replaceWith(t.objectExpression([load, resolveWeak, chunk]));
          
        }
      }
    }
  };
};