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

    const buildChunkName = (chunkNameCmt) => (
        t.objectProperty(
            t.identifier('chunk'),
            t.arrowFunctionExpression(
                [],
                t.stringLiteral(chunkNameCmt.value.split('"')[1]),
            )
        )
    )
    const getProgramPath = path => path.find((p) => t.isProgram(p.node));

    const handleImportCss = (path, importCss) => {
        if (importCss) {
            const declaration = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('ImportCss'))],
                t.stringLiteral('react-asyncmodule-tool/dist/importcss')
            );
            const programPath = getProgramPath(path)
            const fstLn = programPath.node.body[0];
            const existedImportCss = t.isImportDeclaration(fstLn) && fstLn.specifiers.length && fstLn.specifiers[0].local.name === fstLn.specifiers[0].local.name === 'ImportCss'
            if (!existedImportCss) {
                programPath.unshiftContainer('body', declaration);
            }
        }
    }
    const astParser = (path, importCss) => {
        handleImportCss(path, importCss);
        // add leadingComments to the import argument module
        const {type: nodeType} = path.node;
        let importPath = '';
        let module='';
        if (nodeType === 'CallExpression') {
            importPath = path.get('arguments.0');
        }
        if (nodeType === 'ArrowFunctionExpression') {
            importPath = path.get('body');
        }
        [module] = importPath.node.arguments;
        const { modulePath, moduleName } = addComments(module);

        const load = buildLoad(importPath, moduleName, importCss);
        const resolveWeak = buildResolveWeak(modulePath);
        const chunkNameCmt = module.leadingComments.find(cmt=>(cmt.value.includes('webpackChunkName')));
        const chunk = buildChunkName(chunkNameCmt);

        importPath.replaceWith(t.objectExpression([load, resolveWeak, chunk]));
    }
    return {
        visitor: {
            CallExpression(path, {
                opts = {}
            }) {
                const { node } = path;
                const { importCss } = opts;
                if (!node) return;

                if (t.isCallExpression(node.arguments[0]) && t.isImport(node.arguments[0].callee)) {
                    astParser(path, importCss);
                }
            },
            ArrowFunctionExpression(path, {
                opts={}
            }) {
                const { node } = path;
                const { importCss } = opts;
                if (!node) return;

                if (t.isCallExpression(node.body) && t.isImport(node.body.callee)) {
                    astParser(path, importCss);
                }
            }
        }
    };
};