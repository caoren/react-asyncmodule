import AsyncModule from 'react-asyncmodule'; 
const Home = AsyncComponent(import('./views/home'));
const Side = AsyncComponent(import('./views/side'));
const Footer = AsyncComponent(import('./views/footer'));