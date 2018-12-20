import ImportCss from 'react-asyncmodule-tool/dist/importcss';
import AsyncModule from 'react-asyncmodule'; 
const Home = AsyncComponent({
  load: () => Promise.all([import( /*webpackChunkName: "home"*/'./views/home'), ImportCss('home')]).then(jsprim => jsprim[0]),
  resolveWeak: () => require.resolveWeak('./views/home'),
  chunk: () => 'home'
});
const Side = AsyncComponent({
  load: () => Promise.all([import( /*webpackChunkName: "side"*/'./views/side'), ImportCss('side')]).then(jsprim => jsprim[0]),
  resolveWeak: () => require.resolveWeak('./views/side'),
  chunk: () => 'side'
});
const Footer = AsyncComponent({
  load: () => Promise.all([import( /*webpackChunkName: "footer"*/'./views/footer'), ImportCss('footer')]).then(jsprim => jsprim[0]),
  resolveWeak: () => require.resolveWeak('./views/footer'),
  chunk: () => 'footer'
});