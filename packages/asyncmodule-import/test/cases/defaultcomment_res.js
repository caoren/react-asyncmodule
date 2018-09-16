import AsyncModule from 'react-asyncmodule';
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = AsyncComponent({
    load: () => Promise.all([import(
        /* webpackChunkName: "ilikethis" */
        /* webpackMode: "lazy" */
        './views/home'
    )]).then(jsprim => jsprim[0]),
    resolveWeak: () => require.resolveWeak('./views/home'),
    chunk: () => 'ilikethis'
});