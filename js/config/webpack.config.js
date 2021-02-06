const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');

const publicPath = '/';

const IS_DEV = process.env.NODE_ENV === 'development';
module.exports = {
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'eval' : 'source-map',
    entry: {
        main: [
            path.resolve(__dirname, './main.js'),
            path.resolve(__dirname, '../../sass/main.scss')
        ]
    },
    output: {
        path: path.resolve(__dirname + '../../../', 'public'), // Absolute path
        filename: '[name].js',
        publicPath: publicPath
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: { url: false, sourceMap: true, },
                },
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, "postcss.config.js"),
                            plugins: [
                                [
                                    autoprefixer()
                                ],
                            ],
                            sourceMap: true
                        },
                    },
                },

                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    },
                }]
        }]
        // Loaders start from right to left -> sass-loader -> postcss-loader -> css-loader
    },
    optimization: {
        minimize: !IS_DEV,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, '../../views'),
        //         to: path.resolve(__dirname, '../../public'),
        //         toType: 'dir',
        //     },
        // ]),
        new MiniCssExtractPlugin({ filename: "[name].css" }),
        new webpack.LoaderOptionsPlugin({ minimize: !IS_DEV }),
        new webpack.ProvidePlugin({})
    ]
};

if (!IS_DEV) {
    module.exports.plugins.push(new TerserPlugin());
}
