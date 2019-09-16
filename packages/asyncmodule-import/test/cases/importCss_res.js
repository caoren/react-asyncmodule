const Home = AsyncComponent({
  load: () => import( /*webpackChunkName: "home"*/'./views/home'),
  resolveWeak: () => require.resolveWeak('./views/home'),
  chunk: () => 'home'
})