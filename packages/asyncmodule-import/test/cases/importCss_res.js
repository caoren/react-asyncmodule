import ImportCss from 'react-asyncmodule-tool/dist/importcss';
const Home = AsyncComponent({
  load: () => Promise.all([import( /*webpackChunkName: "home"*/'./views/home'), ImportCss('home')]).then(jsprim => jsprim[0]),
  resolveWeak: () => require.resolveWeak('./views/home'),
  chunk: () => 'home'
});