import ImportCss from 'babel-plugin-asyncmodule-import/lib/importcss';
const Home = AsyncComponent({
  load: () => Promise.all([import( /*webpackChunkName: "home"*/'./views/home'), ImportCss('home')]).then(jsprim => jsprim[0]),
  resolveWeak: () => require.resolveWeak('./views/home'),
  chunk: () => 'home'
});