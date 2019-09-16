import AsyncModule from 'react-asyncmodule';
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = AsyncComponent({
    load: () => import(
        /* webpackChunkName: "ilikethis" */
        /* webpackMode: "lazy" */
        './views/home'
    ),
    resolveWeak: () => require.resolveWeak('./views/home'),
    chunk: () => 'ilikethis'
});