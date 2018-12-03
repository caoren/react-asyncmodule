export const A = AsyncImport({
    load() {
        import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});