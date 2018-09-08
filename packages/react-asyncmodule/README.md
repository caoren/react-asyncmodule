# react-asyncmodule

webpack2+版本，推荐使用`import`方法实现code split，`react-asyncmodule`组件可以帮助你简化代码。

基本配置

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

从上面代码我们会发现loading和error基本都是一样的，可以进一步简化。

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
好多了，但还可以再精简一下，这次需要用到[babel-plugin-asyncmodule-import](https://github.com/caoren/react-asyncmodule/tree/master/packages/asyncmodule-import)插件。

```javascript
const Home = AsyncComponent(import('./home'));
const List = AsyncComponent(import('./list'));
```
现在方便多了。

## API

```javascript
AsyncModule(Options);
```

## Options

### load

函数，返回一个`Promise`实例。通常由webpack提供的import方法生成，若没有传入该参数，则只返回一个方法，而不是组件。

### resolveWeak

函数，返回当前import组件的moduleId，由webpack的`require.resolveWeak`方法自动生成。

### loading

加载中显示的组件。

### error

加载错误时显示的组件，会传入2个props，分别是`onRetry`和`error`。

### delay

延时显示`loading`组件，单位ms。默认200ms，有时候网速过快显示loading反而效果不好。

### timeout

加载超时时间，单位ms。默认2分钟。
