# react-asyncmodule-tool

react-asyncmodule related method.

# Installation

```javascript
npm install react-asyncmodule-tool
```

Es6 used.

```javascript
import {
    createAssets,
    exportAssets,
    getChunksByMatch,
    ImportCss
} from 'react-asyncmodule-tool';
```


## API

### createAssets(chunks, publicPath)

Serialized resource path based on the webpack's chunks

```javascript
const assets = createAssets([...], '/public/');
// output
{
    js: {
        a: '/public/a.js'
    },
    css: {
        a: '/public/a.css'
    }
}
```

### exportAssets(chunkObj, chunkNames)

Output full resource path matching `chunkNames`.

```javascript
const resource = exportAssets({
    js: {
        a: '/public/a.js'
    },
    css: {
        a: '/public/a.css'
    }
}, ['a']);
// output
{
    js: '<script type="text/javascript" src="/public/a.js"></script>',
    css: '<link type="text/css" href="/public/a.css" rel="stylesheet">'
}
```

### getChunksByMatch(matchRoutes)

Output corresponding `chunkNames` and `comps` according to `matchRoutes`.

```javascript
const resource = getChunksByMatch([
{
    route: {
        path: '/list',
        exact: true,
        component: {
            chunk: () => 'list',
            comp: {}
        }
    },
    match: {
        path: '/list',
        url: '/list',
        isExact: true,
        params: {}
    }
}]);
// output
{
    chunkNames: ['list'],
    comps: [{}]
}
```

### ImportCss(chunkName)

Source code from [this](https://github.com/faceyspacey/babel-plugin-dual-import). Usually used in scenes where CSS Split by route.

```javascript
ImportCss('a'); // return a Promise instance
```