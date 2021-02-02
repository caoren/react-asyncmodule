module.exports = function (api) {
    api.cache(true);
    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "modules": 'commonjs',
                    "loose": true
                }
            ],
            [ 
                "babel-preset-collection",
                {
                    commonjs: true,
                    transformRuntimeOption: { corejs: false }
                }
            ],
            "@babel/preset-react"
        ],
        "plugins": ['add-module-exports']
    }
}