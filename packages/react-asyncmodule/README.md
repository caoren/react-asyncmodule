# react-asyncmodule

webpack2+, it's recommended to use `import` method implementation code spliting, this component can help you simplify your code.

## Installation

```javascript
npm install react-asyncmodule --save
```

## Basic usage

```javascript
import AsyncModule from 'react-asyncmodule';

const Home = AsyncModule({
    load: () => import(/* webpackChunkName: "home" */ './home'),
    resolveWeak: () => require.resolveWeak('./home'),
    chunk: () => 'home',
    loading: <Loading />,
    error: <ErrorView />
});

const List = AsyncModule({
    load: () => import(/* webpackChunkName: "list" */ './list'),
    resolveWeak: () => require.resolveWeak('./list'),
    chunk: () => 'list',
    loading: <Loading />,
    error: <ErrorView />
});
```

通过上面的代码，我们可以发现 `loading` and `error` 2个选项是相同的，可以这样简化。

```javascript
const AsyncComponent = AsyncModule({
    loading: <Loading />,
    error: <ErrorView />
});

const Home = AsyncComponent({
    load: () => import(/* webpackChunkName: "home" */ './home'),
    resolveWeak: () => require.resolveWeak('./home'),
    chunk: () => 'home'
});

const List = AsyncModule({
    load: () => import(/* webpackChunkName: "list" */ './list'),
    resolveWeak: () => require.resolveWeak('./list'),
    chunk: () => 'list'
});
```
很好，但是还有一些重复的代码。

```javascript
const Home = AsyncComponent(import('./home'));
const List = AsyncComponent(import('./list'));
```

完美，使用这个 babel 插件 [babel-plugin-asyncmodule-import](https://github.com/caoren/react-asyncmodule/tree/master/packages/asyncmodule-import)。

返回的 AsnycComponent 组件上有以下一些静态属性和方法。

### chunkName

属性，返回当前组件的 chunk 名称，即上面代码中的 `chunk` 方法的返回值。

### preload

预加载方法，返回一个 promise 实例，可在回调中获取到当前组件。

### preloadWeak

预加载方法，不同于 `preload`，该方法是同步返回当前的组件，通常用于 server render。


## AsyncChunk

该组件获取到当前匹配到的组件的 `chunkName`(就是上面 chunk 方法的返回) 和 `getInitialData` 组件上的静态方法，通常用于 server render。

```javascript
import { AsyncChunk } from 'react-asyncmodule';
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

## API

```javascript
AsyncModule(Options);
```

## Options

### load

函数, 返回一个 `Promise` 实例. 通常由 webpack 提供的 `import` 方法生成.

### render

自定义渲染函数，接收两个参数分别是 `props` 和 `Component`。

```javascript
const List = AsyncModule({
    load: () => import(/* webpackChunkName: "list" */ './list'),
    render: (props, Comp) => <Comp {...props} />
});
```

### resolveWeak

返回当前导入组件的 moduleId。由 webpack 的 `require.resolveWeak` 方法自动生成。

### loading

加载时显示的组件。


### error

加载错误时显示的组件。 接受两个参数`onRetry`和`error`。


### delay

默认 `200` ms。 `loading` 组件延迟显示的时间，单位ms。

当网络速度很快时，用户看不到加载组件。

### timeout

默认 `120000` ms。 加载超时，单位ms。
