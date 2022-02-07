import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

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

export default config;
