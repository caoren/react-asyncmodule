export const A = AsyncImport({
    load() {
        import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});
export const B = AsyncImport({
    load() {
        return import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});