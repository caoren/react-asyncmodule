'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const args = require('yargs').argv;
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const AutoPrefixer = require('autoprefixer');

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
                                    browsers: ['IOS >= 8.0', 'Android >= 4.4']
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
                            'asyncmodule-import'
                        ],
                        cacheDirectory: true
                    }
                }]
            },
            {
                test: /\.(css|less)?$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [ AutoPrefixer ]
                        }
                    },
                    {
                        loader: 'less-loader',
                    }
                ]
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
    config.mode = 'production';
    config.output.filename = '[name].[chunkhash:8].js';
    config.output.chunkFilename = '[name].[chunkhash:8].js';
    config.plugins = [
        new ExtractCssChunks({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].css'
        })
    ];
} else {
    config.mode = 'development';
    config.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractCssChunks({
            filename: '[name].css',
            chunkFilename: '[name].css'
        })
    ];
}
module.exports = config;