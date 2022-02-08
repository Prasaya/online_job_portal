/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const dirname = __dirname;

const config = {
    /**
     * @type {("none" | "development" | "production")}
     */
    mode: process.env.NODE_ENV || 'development',
    entry: './src/bin/www',
    output: {
        path: path.join(
            dirname,
            'dist',
        ),
        filename: 'backend.cjs',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
        alias: {
            '@root': path.resolve('./src'),
            '@middleware': path.resolve('./src/middleware'),
            '@models': path.resolve('./src/models'),
            '@routes': path.resolve('./src/routes'),
            '@utils': path.resolve('./src/utils'),
            '@typings': path.resolve('./src/typings'),
        },
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
};

module.exports = config;
