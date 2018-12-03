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
    load: ()=>import('./a')
});
const Homex = rand_Component(import(/*webpackChunkName: "arandomname"*/'./views/homex'));