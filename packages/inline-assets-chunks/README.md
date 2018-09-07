# inline-assets-webpack-plugin

webpack插件，用于提取asset chunks，通常用在单页应用的css分离处理上。依赖[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)把asset chunks输出在html上。

搭配[babel-plugin-asyncmodule-import](https://github.com/caoren/react-asyncmodule/tree/master/packages/asyncmodule-import/)的importcss。

注：如css不做分离，则不需要使用该插件。

## 使用

```javascript
npm install html-webpack-plugin  --save-dev
npm install inline-assets-webpack-plugin  --save-dev
```

webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsChunkPlugin = require('inline-assets-webpack-plugin');

module.exports = {
    ...
    plugins: [
        new HtmlWebpackPlugin(),
        new AssetsChunkPlugin(options)
    ]
};
```
最后页面上生成如下代码
```javascript
<script type="text/javascript">window.__ASSETS_CHUNKS__ = {
    "app":"/dist/app.49a9342d.css"
}
</script>
```

## Options

### inject

'head | body'，生成的`script`块放置位置

### output

输出资源asset chunks的目录文件，如`path.resolve(__dirname, './build/assets.json')`。
通常给`production`的node端使用，不需要依赖开发环境的构建。