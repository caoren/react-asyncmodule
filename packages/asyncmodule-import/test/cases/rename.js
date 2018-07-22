import rand_AsyncModule from 'react-asyncmodule';
const rand_Component = rand_AsyncModule({
    delay: 300
});
const Homex = rand_Component(import('./views/homex'));