const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    entry: './src/client/index.js',
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMap: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } } // Ignorar index.html
            ]
        }),
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    resolve: {
        fallback: {
            "fs": false,
            "os": require.resolve("os-browserify/browser"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "querystring": require.resolve("querystring-es3"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "path": require.resolve("path-browserify"),
            "net": false,
            "tls": false,
            "child_process": false,
            "dns": false,
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 9000
    }
};