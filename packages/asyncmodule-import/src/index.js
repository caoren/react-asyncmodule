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
        } else if (!module.leadingComments.filter(cmt => cmt.value.indexOf('webpackChunkName') !== -1).length) {
            module.leadingComments.push({
                type: "CommentBlock",
                value: `webpackChunkName: "${moduleName}"`
            });
        }
        return {
            modulePath,
            moduleName
        };
    };

    const buildLoad = (importPath, moduleName) => {
        return t.objectProperty(
            t.identifier('load'),
            t.arrowFunctionExpression([],importPath.node)
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

    const astParser = (path, returnImport = undefined) => {
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

        const load = buildLoad(importPath, moduleName);
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
            CallExpression(path, { opts }) {
                const { node } = path;
                if (t.isCallExpression(node.arguments[0]) && t.isImport(node.arguments[0].callee) && node.callee.name !== 'Promise') {
                    astParser(path);
                }
            },
            ObjectProperty(path, { opts }) {
                const { node } = path;
                let returnImport = undefined;
                if (node.key.name === 'load' && t.isArrowFunctionExpression(node.value)) {
                    const alreadyCmted = node.value.body.arguments && node.value.body.arguments[0].leadingComments && node.value.body.arguments[0].leadingComments.some(cmt => cmt.value.indexOf('webpackChunkName') !== -1)
                    if (node.value.body && t.isCallExpression(node.value.body) && t.isImport(node.value.body.callee) && !alreadyCmted) {
                        returnImport = false;
                    } else if (node.value.body&& t.isBlockStatement(node.value.body) && t.isReturnStatement(node.value.body.body[0]) && t.isCallExpression(node.value.body.body[0].argument) && t.isImport(node.value.body.body[0].argument.callee)) {
                        returnImport = true;
                    }
                    if (returnImport !== undefined) {
                        astParser(path, returnImport);
                    }
                } else {
                    return;
                }
            },
            ObjectMethod(path, { opts }) {
                const { node } = path;
                if (node.key.name === 'load' &&  t.isBlockStatement(node.body) && t.isReturnStatement(node.body.body[0]) && t.isCallExpression(node.body.body[0].argument) && t.isImport(node.body.body[0].argument.callee)) {
                    astParser(path);
                } else {
                    return;
                }
            }
        }
    };
};