export const A = AsyncImport({
    load: () => Promise.all([import( /*webpackChunkName: "a"*/'./a')]).then(jsprim => jsprim[0]),
    resolveWeak: () => require.resolveWeak('./a'),
    chunk: () => 'a',
    loading: 'LoadingView',
    error: 'ErrorView'
});
export const B = AsyncImport({
    load: () => Promise.all([import( /*webpackChunkName: "a"*/'./a')]).then(jsprim => jsprim[0]),
    resolveWeak: () => require.resolveWeak('./a'),
    chunk: () => 'a',
    loading: 'LoadingView',
    error: 'ErrorView'
});