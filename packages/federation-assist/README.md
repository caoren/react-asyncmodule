# asyncmodule-federation-webpack-plugin

> Some webpack plugin, and webpack 5+.


## Installation

> npm i asyncmodule-federation-webpack-plugin

## used

```javascript
const AttachedFederationPlugin = require("asyncmodule-federation-webpack-plugin");
const {
    LastExportModulePlugin,
    FederationRuntime
} = AttachedFederationPlugin;
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const remotes = {
    app1: "http://localhost:7070/app1/remoteEntry.js"
};
// webpack.config.js
{
    ...
    plugins: [
        new ModuleFederationPlugin({
            name: "test",
            library: { type: "var", name: "test" },
            filename: "remoteEntry.js",
            remotes: remotes,
            shared: {
                'react': {
                    eager: true,
                    requiredVersion: "^16.3"
                }
            }
        }),
        new LastExportModulePlugin({
            entryChunkName: 'server'
        }),
        new FederationRuntime({
            remotes
        }),
        new AttachedFederationPlugin({
            name: "test"
        })
    ]
}
```

### AttachedFederationPlugin

* 收集 remote federation chunk 依赖的资源(js, css)，输出在 stats.json 的 exposesMap 中;
* 收集 host chunk 依赖的 federation chunk，输出在 stats.json 的 remotesMap 中;
* 汇总 host chunk 依赖的 federation moduleName，输出在 stats.json 的 remotesRelatedDepends 中;

```js
// stats.json
{
    "remotesRelatedDepends": [
        "webpack/container/reference/app1",
        "webpack/container/remote/app1/Test",
    ],
    "remotesMap": {
        "test": [
            {
                "shareScope": "default",
                "name": "./Test",
                "externalModuleId": "webpack/container/reference/app1"
            }
        ]
    },
    "exposesMap": {
        "./Test": [
            "test",
            "common"
        ]
    }
}
```

### FederationRuntime

让 node 端支持异步获取 remoteEntry.js。

```js
// webpack 编译后代码
const __webpack_modules__ = {
    ...
    "webpack/container/reference/app1": (module) => {
        "use strict";
        module.exports = require('http://localhost:7070/app1/remoteEntry.js');
    }
}

// 替换后

const __webpack_modules__ = {
    ...
    "webpack/container/reference/app1": (module) => {
        "use strict";
        var replaceFederationRuntime = require('asyncmodule-federation-webpack-plugin').replaceFederationRuntime;  module.exports = replaceFederationRuntime('http://localhost:7070/app1/remoteEntry.js');
    }
}
```
