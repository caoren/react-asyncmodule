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
    getChunkAssets
} from 'react-asyncmodule-tool';
```


## API

### createAssets(chunks, publicPath)

Serialized resource path based on the webpack's chunks

```javascript
const assets = createAssets(stats);
// output
{
    a: {
        js: ['/public/a.js'],
        css: ['/public/a.css']
    },
    b: {
        js: ['/public/common.js', '/public/b.js'],
        css: ['/public/common.css', '/public/b.css']
    }
}
```


### getChunkAssets(assets, chunkName)

Output `chunkNames` according to [matchRoutes](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#matchroutesroutes-pathname).

```javascript
getChunkAssets({
   a: {
       js: ['/public/a.js'],
       css: ['/public/a.css']
   },
   b: {
       js: ['/public/common.js', '/public/b.js'],
       css: ['/public/common.css', '/public/b.css']
   }
}, 'a');

// output

{
   js: '<script type="text/javascript" src="/public/a.js"></script>',
   css: '<link href="/public/a.css" rel="stylesheet">'
}
```