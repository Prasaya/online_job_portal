const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    /**
     * @type {("none" | "development" | "production")}
     */
    mode: 'development',
    entry: './src/bin/www',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'backend.cjs',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
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
