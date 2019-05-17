'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const args = require('yargs').argv;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = args.env;
const isDeploy = env === 'production';
const config = {
    entry: {
        test: path.resolve(__dirname, 'index.js')
    },
    output: {
        path: path.resolve(__dirname, '../demo'),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    fix: true
                }
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                targets: {
                                    browsers: ['IOS >= 7.0', 'Android >= 4.0']
                                },
                                modules: 'commonjs',
                                debug: true,
                                useBuiltIns: true
                            }],
                            'react',
                            'stage-0'
                        ],
                        plugins: [
                            'syntax-dynamic-import',
                            'react-hot-loader/babel'
                        ],
                        cacheDirectory: true
                    }
                }]
            },
            {
                test: /\.(css|less)?$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')({
                                        browsers: ['IOS >= 7.0', 'Android >= 4.0']
                                    })
                                ]
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif|svg|cur)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2560,
                        name: '[path][name].[ext]'
                    }
                }]
            }
        ]
    },
    devtool: isDeploy ? false : 'inline-source-map'
};
if (isDeploy) {
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env)
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ];
} else {
    config.plugins = [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ];
}
module.exports = config;