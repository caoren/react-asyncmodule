# @music/babel-plugin-asyncmodule-import

> mrc的babel插件，用于异步模块导入


## 安装
> nenpm install @music/babel-plugin-asyncmodule-import

## 版本

## babel-loader中使用

``` javascript
    {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: {
                plugins: [
                    ['@music/asyncmodule-import', { ... }]
                    ...
                ]
            }
        }]
    }
```

## 参数

Name             | Type       | Default          | Description
-----------------|------------|------------------|--------------
[importCss]       | `Boolean`   |  `true`  | 是否调用ImportCss加载css

## 说明
该插件用于以下转换
```javascript
import AsyncModule from 'react-asyncmodule'; 
const AsyncComponent = AsyncModule({
    delay: 300,
    ...
});
const Home = AsyncComponent(import('./views/home'));
```

```javascript
import AsyncModule from 'react-asyncmodule';
import ImportCss from 'babel-plugin-asyncmodule-import/importcss';
const AsyncComponent = AsyncModule({
    delay: 300,
    ...
});
const Home = AsyncComponent({
    load: () => Promise.all([import( /*webpackChunkName: "home"*/'./views/home'), ImportCss('home')]).then(jsprim => jsprim[0]),
    resolveWeak: () => require.resolveWeak('./views/home')
});
```