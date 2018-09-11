# inline-assets-webpack-plugin

A webpack Plugin. Extract asset chunks, usually used in css separation processing for single-page applications. Output asset chunks on html via [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).

[react-asyncmodule-tool](https://github.com/caoren/react-asyncmodule/tree/master/packages/react-asyncmodule-tool/)'s importcss relay on the plugin.


## Installation

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
html inline code like this

```javascript
<script type="text/javascript">
window.__ASSETS_CHUNKS__ = {
    "app":"/dist/app.49a9342d.css"
}
</script>
```

## Options

### name

default 'webpackInlineAssetsChunks'. 

Mounted on the `htmlWebpackPlugin.files` object, the corresponding script block can be generated in the html template using `{{{htmlWebpackPlugin.files.webpackInlineAssetsChunks}}}}`.

Used in webpack v4-.

### inject

'head | body'. The location of the generated `script` block, Used in webpack v4.

### output

Directory filename for `assetchunks`. Such as`path.resolve(__dirname, './build/assets.json')`.The generated files are used in the `production` server side.