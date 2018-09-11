export default function(_ref) {
    let t = _ref.types;
    let asyncModule = 'asyncModule',
        asyncComponent = 'asyncComponent';

    const addComments = module => {
        const modulePath = module.value;
        const moduleName = modulePath.split('/')[modulePath.split('/').length - 1];
        if (!module.leadingComments) {
            module.leadingComments = [{
                type: "CommentBlock",
                value: `webpackChunkName: "${moduleName}"`
            }];
        }
        return {
            modulePath,
            moduleName
        };
    };

    const buildLoad = (importPath, moduleName, importCss = false) => {
        let loadMaterials = [importPath.node];

        if (importCss) {
            loadMaterials.push(t.callExpression(t.identifier('ImportCss'), [t.stringLiteral(moduleName)]))
        }
        return t.objectProperty(
            t.identifier('load'),
            t.arrowFunctionExpression(
                [],
                t.callExpression(
                    t.memberExpression(
                        t.callExpression(
                            t.memberExpression(t.identifier('Promise'), t.identifier('all')), [
                                t.arrayExpression(loadMaterials)
                            ]
                        ),
                        t.identifier('then'),
                    ), [
                        t.arrowFunctionExpression(
                            [t.identifier('jsprim')],
                            t.memberExpression(t.identifier('jsprim'), t.NumericLiteral(0), true),
                        )
                    ]
                ),
            )
        )
    };

    const buildResolveWeak = (modulePath) => (
        t.objectProperty(
            t.identifier('resolveWeak'),
            t.arrowFunctionExpression(
                [],
                t.callExpression(
                    t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')), [t.stringLiteral(modulePath)]
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
            CallExpression(path, {
                opts = {}
            }) {
                const {
                    node
                } = path;
                const {
                    importCss
                } = opts;
                if (!node) {
                    return;
                }
                if (t.isCallExpression(node.arguments[0]) && t.isImport(node.arguments[0].callee)) {
                    if (importCss) {
                        const declaration = t.importDeclaration(
                            [t.importDefaultSpecifier(t.identifier('ImportCss'))],
                            t.stringLiteral('react-asyncmodule-tool/dist/importcss')
                        );
                        const programPath = path.find((p) => {
                            return t.isProgram(p.node);
                        });
                        programPath.unshiftContainer('body', declaration);
                    }
                    // add leadingComments to the import argument module
                    const importPath = path.get('arguments.0');
                    const [module] = importPath.node.arguments;
                    const {
                        modulePath,
                        moduleName
                    } = addComments(module);

                    const load = buildLoad(importPath, moduleName, importCss);
                    const resolveWeak = buildResolveWeak(modulePath);
                    const chunk = buildChunkName(moduleName);

                    importPath.replaceWith(t.objectExpression([load, resolveWeak, chunk]));
                }
            }
        }
    };
};