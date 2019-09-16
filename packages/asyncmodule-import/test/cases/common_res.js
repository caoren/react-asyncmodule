import AsyncModule from 'react-asyncmodule';
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = AsyncComponent({
    load: () => import( /*webpackChunkName: "home"*/'./views/home'),
    resolveWeak: () => require.resolveWeak('./views/home'),
    chunk: () => 'home'
});