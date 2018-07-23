import AsyncModule from 'react-asyncmodule';
import ImportCss from 'babel-plugin-asyncmodule-import/lib/importcss';
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = AsyncComponent({
    load: () => Promise.all([import( /*webpackChunkName: "home"*/'./views/home'), ImportCss('home')]).then(jsprim => jsprim[0]),
    resolveWeak: () => require.resolveWeak('./views/home')
});