export const A = AsyncImport({
    load: () => import( /*webpackChunkName: "a"*/'./a'),
    resolveWeak: () => require.resolveWeak('./a'),
    chunk: () => 'a',
    loading: 'LoadingView',
    error: 'ErrorView'
});
export const B = AsyncImport({
    load: () => import( /*webpackChunkName: "b"*/'./b'),
    resolveWeak: () => require.resolveWeak('./b'),
    chunk: () => 'b',
    loading: 'LoadingView',
    error: 'ErrorView'
});