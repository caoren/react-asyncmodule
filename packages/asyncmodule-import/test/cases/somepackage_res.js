import AsyncModule from 'somepack';
const AsyncComponent = AsyncModule({
    delay: 300
});
const Home = AsyncComponent(import('./views/home'));