const Homex = rand_Component({
  load: () => import( /* webpackPrefetch: true */ /*webpackChunkName: "homex"*/ './views/homex'),
  resolveWeak: () => require.resolveWeak('./views/homex'),
  chunk: () => 'homex'
});