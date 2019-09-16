export const A = AsyncImport({
    load: () => import( /*webpackChunkName: "a"*/'./a'),
    resolveWeak: () => require.resolveWeak('./a'),
    chunk: () => 'a',
    loading: 'LoadingView',
    error: 'ErrorView'
});