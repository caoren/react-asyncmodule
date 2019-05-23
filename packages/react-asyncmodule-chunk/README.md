# react-asyncmodule-chunk

react-asyncmodule's Provider.

# Installation

```javascript
npm install react-asyncmodule-chunk
```

## AsyncChunk

该组件获取到当前匹配到的组件的 `chunkName`(就是上面 chunk 方法的返回) 和 `getInitialData` 组件上的静态方法，通常用于 server render。

```javascript
import AsyncChunk from 'react-asyncmodule-chunk';
import { StaticRouter } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';

const context = {};
const modules = [];
const saveModule = (module) => {
    modules.push(module);
}
renderToStaticMarkup(
    <StaticRouter
        location={url}
        context={context}
    >
        <AsyncChunk report={saveModule}>
            <Approutes />
        </AsyncChunk>
    </StaticRouter>
);
// [{ chunkName: 'list', getInitialData: [Function] ]
```

如果你未使用任何第三方数据状态管理库(如redux)，获取到数据后可通过 `AsyncChunk` 组件的 `receiveData` props传递数据至组件上。

```javascript
module[0].getInitialData({ ctx.req }).then((data) => {
    const html = renderToString(
        <StaticRouter
                location={url}
                context={context}
            >
            <AsyncChunk receiveData={data}>
                <Approutes />
            </AsyncChunk>
        </StaticRouter>
    );
});
```
