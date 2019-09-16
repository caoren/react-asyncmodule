# babel-plugin-asyncmodule-import

> A Babel Plugin，for [react-asyncmodule](https://github.com/caoren/react-asyncmodule.git), can be used for tranfroming async module importing.


## Installation

> npm i -D babel-plugin-asyncmodule-import

## used in webpack babel-loader

```javascript
{
    test: /\.(js|jsx)?$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader',
        options: {
            plugins: [
                'asyncmodule-import',
                ...
            ]
        }
    }]
}
```

## What it does

If you're using dynamic imports by `react-asyncmodule`

```javascript
// when importCss set true
import AsyncModule from 'react-asyncmodule'; 
const AsyncComponent = AsyncModule({
    delay: 300,
    ...
});
const Home = AsyncComponent(import('./views/home'));  

 ↓ ↓ ↓ ↓ ↓ ↓  

import AsyncModule from 'react-asyncmodule';
const AsyncComponent = AsyncModule({
    delay: 300,
    ...
});
const Home = AsyncComponent({
    load: () => import( /*webpackChunkName: "home"*/'./views/home'),
    resolveWeak: () => require.resolveWeak('./views/home')
});
```

```javascript
import AsyncModule from 'react-asyncmodule';
const AsyncComponent = AsyncModule({
    delay: 300,
    ...
});
// arrow function & magic comment compatibility
const A = AsyncModule({
    load: () => import( /* webpackPrefetch: true */'./a'),
    loading: 'LoadingView',
    error: 'ErrorView',
});
// arrow function in blockstament
const B = AsyncModule({
    load: () => {
        return import('./b');
    },
    loading: 'LoadingView',
    error: 'ErrorView',
});
// es6 object method
const C = AsyncModule({
    load() {
        return import('./c');
    },
    loading: 'LoadingView',
    error: 'ErrorView',
});

 ↓ ↓ ↓ ↓ ↓ ↓
 
import AsyncModule from 'react-asyncmodule';
const AsyncComponent = AsyncModule({
    delay: 300,
    ...
});

const A = AsyncModule({
    load: () => import( /* webpackPrefetch: true */ /*webpackChunkName: "a"*/ './a')]),
    resolveWeak: () => require.resolveWeak('./a'),
    chunk: () => 'a',
    loading: 'LoadingView',
    error: 'ErrorView'
});

const B = AsyncModule({
    load: () => import( /*webpackChunkName: "b"*/'./b'),
    resolveWeak: () => require.resolveWeak('./b'),
    chunk: () => 'b',
    loading: 'LoadingView',
    error: 'ErrorView'
});

const C = AsyncModule({
    load: () => import( /*webpackChunkName: "c"*/'./c'),
    resolveWeak: () => require.resolveWeak('./c'),
    chunk: () => 'c',
    loading: 'LoadingView',
    error: 'ErrorView'
});
```

> Css split can be implemented by [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin)