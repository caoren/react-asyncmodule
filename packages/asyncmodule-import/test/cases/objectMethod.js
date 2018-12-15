export const A = AsyncImport({
    load() {
        return import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});