export default function(_ref) {
    let t = _ref.types;

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

    const buildLoad = (importPath, moduleName, importCss) => {
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
            const programPath = getProgramPath(path);
            if (!programPath.scope.existedImportCss) {
                programPath.unshiftContainer('body', declaration);
                programPath.scope.existedImportCss = true;
            }
        }
    }

    const astParser = (path, importCss, returnImport=undefined) => {
        handleImportCss(path, importCss);
        // add leadingComments to the import argument module
        const { type: nodeType } = path.node;
        let importPath = '';
        let module='';
        if (nodeType === 'CallExpression') {
            importPath = path.get('arguments.0');
        }
        if (nodeType === 'ObjectProperty') {
            importPath = !returnImport ? path.get('value.body') : path.get('value.body.body.0.argument');
        }
        if (nodeType === 'ObjectMethod') {
            importPath = path.get('body.body.0.argument');
        }
        [module] = importPath.node.arguments;
        const { modulePath, moduleName } = addComments(module);

        const load = buildLoad(importPath, moduleName, importCss);
        const resolveWeak = buildResolveWeak(modulePath);
        const chunkNameCmt = module.leadingComments.find(cmt=>(cmt.value.includes('webpackChunkName')));
        const chunk = buildChunkName(chunkNameCmt);
        if (nodeType === 'CallExpression') {
            importPath.replaceWith(t.objectExpression([load, resolveWeak, chunk]));
        }
        if (nodeType === 'ObjectProperty') {
            const more = path.parent.properties.splice(1);
            const nmore = more.map((property,index)=>{
                return t.objectProperty(property.key, property.value)
            });
            path.replaceWithMultiple([load, resolveWeak, chunk].concat(nmore));
        }
        if (nodeType === 'ObjectMethod') {
            const more = path.parent.properties.splice(1);
            const nmore = more.map((property,index)=>{
                return t.objectProperty(property.key, property.value)
            });
            path.replaceWithMultiple([load, resolveWeak, chunk].concat(nmore));
        }
    }
    return {
        visitor: {
            ImportDeclaration(path) {
                const { node } = path;
                const programPath = getProgramPath(path);
                if (node.specifiers.length && node.specifiers[0].local.name === 'ImportCss') {
                    programPath.scope.existedImportCss = true;
                }
            },
            CallExpression(path, { opts }) {
                const { node } = path;
                const importCss = opts && opts.importCss || false;

                if (t.isCallExpression(node.arguments[0]) && t.isImport(node.arguments[0].callee)) {
                    astParser(path, importCss);
                }
            },
            ObjectProperty(path, { opts }) {
                const { node } = path;
                const importCss = opts && opts.importCss || false;
                let returnImport = undefined;
                if (node.key.name === 'load' && t.isArrowFunctionExpression(node.value)) {
                    if (node.value.body && t.isCallExpression(node.value.body) && t.isImport(node.value.body.callee)) {
                        returnImport = false;
                    } else if (node.value.body&& t.isBlockStatement(node.value.body) && t.isReturnStatement(node.value.body.body[0]) && t.isCallExpression(node.value.body.body[0].argument) && t.isImport(node.value.body.body[0].argument.callee)) {
                        returnImport = true;
                    }
                    if (returnImport !== undefined) {
                        astParser(path, importCss, returnImport);
                    }
                } else {
                    return;
                }
            },
            ObjectMethod(path, { opts }) {
                const { node } = path;
                const importCss = opts && opts.importCss || false;
                if (node.key.name === 'load' &&  t.isBlockStatement(node.body) && t.isReturnStatement(node.body.body[0]) && t.isCallExpression(node.body.body[0].argument) && t.isImport(node.body.body[0].argument.callee)) {
                    astParser(path, importCss);
                } else {
                    return;
                }
            }
        }
    };
};