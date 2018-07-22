import rand_AsyncModule from 'react-asyncmodule';
import ImportCss from 'babel-plugin-asyncmodule-import/importcss';
const rand_Component = rand_AsyncModule({
    delay: 300
});
const Homex = rand_Component({
    load: () => Promise.all([import( /*webpackChunkName: "homex"*/'./views/homex'), ImportCss('homex')]).then(jsprim => jsprim[0]),
    resolveWeak: () => require.resolveWeak('./views/homex')
});