import AsyncModule from 'react-asyncmodule'; 
import 'react-asyncmodule'; 
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = AsyncComponent(import('./views/home'));
const Side = AsyncComponent(import('./views/side'));

import rand_AsyncModule from 'react-asyncmodule';
const rand_Component = rand_AsyncModule({
    delay: 300
});

export const A = AsyncImport({
    load: () => import('./a'),
    loading: 'LoadingView',
    error: 'ErrorView',
});

export const B = AsyncImport({
    load: () => {
        return import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView',
});
export const Bx = AsyncImport({
    load: () => {
        import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView',
});


export const C = AsyncImport({
    load() {
        return import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView',
});

export const Cx = AsyncImport({
    load() {
        import('./a');
    },
    loading: 'LoadingView',
    error: 'ErrorView',
});

const Homex = rand_Component(import(/*webpackChunkName: "arandomname"*/'./views/homex'));
const Homexx = rand_Component(import(/* webpackPrefetch: true */'./views/homexx'));
const Homexxx = rand_Component(import(/*webpackChunkName: "arandomnamexx"*/ /* webpackPrefetch: true */'./views/homexx'));


