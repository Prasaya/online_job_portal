/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const dirname = __dirname;

const config = {
  // @ts-ignore
  mode: process.env.NODE_ENV || 'development',
  entry: 'bin/www',
  output: {
    path: path.join(dirname, 'dist'),
    filename: 'backend.cjs',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@middleware': path.resolve('./middleware'),
      '@models': path.resolve('./models'),
      '@routes': path.resolve('./routes'),
      '@utils': path.resolve('./utils'),
      '@typings': path.resolve('./typings'),
      '@root': path.resolve('./'),
    },
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
};

module.exports = config;
