export const A = AsyncImport({
    load: () => import('./a'),
    loading: 'LoadingView',
    error: 'ErrorView'
});
export const B = AsyncImport({
    load: () => {
        return import('./b')
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});