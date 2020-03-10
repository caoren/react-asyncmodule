# react-asyncmodule-tool

react-asyncmodule related method.

# Installation

```javascript
npm install react-asyncmodule-tool
```

Es6 used.

```javascript
import {
    createCollect,
    createAssets,
    getChunkAssets
} from 'react-asyncmodule-tool';
```


## API

### createCollect(options)

options的属性

| Name           | Type       | Default | Description         |
| -------------- | ---------- | ------- | ------------------- |
| chunkName      | `string` or `array` | -  | 必填，当前 chunk 的名称，根据该值获取对应的资源文件  |
| stats          | `object`         | -   | 必填，webpack 构建生成的 stats  |
| entrypoints    | `string` or `array`   |  工程的 entry           | 入口文件  |
| asyncChunkKey  | `string` |     -      |  client 端获取依赖 chunk 的 domid  |

```javascript
const collect = createCollect({
    stats,
    chunkName: 'home'
});

collect.getScripts(); // 返回 chunk 所需的脚本，含 async
collect.getStyles(); // 返回 chunk 所需的样式
collect.getInlineStyles().then((data) => { // 返回内联的样式
    console.log(data);
});
```

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