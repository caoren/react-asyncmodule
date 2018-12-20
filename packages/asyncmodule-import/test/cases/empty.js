import AsyncModule from 'react-asyncmodule'; 
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = import('a');
export const A = AsyncImport({
    loadx() {
        import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});
export const B = AsyncImport({
    load() {
        const c = 1;
        import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView'
});