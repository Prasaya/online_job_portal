/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const dirname = __dirname;

const config = {
  // @ts-ignore
  mode: process.env.NODE_ENV || "development",
  entry: "./bin/www",
  output: {
    path: path.join(dirname, "dist"),
    filename: "backend.cjs",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    roots: [dirname],
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@middleware": path.resolve(dirname, "middleware"),
      "@models": path.resolve(dirname, "models"),
      "@routes": path.resolve(dirname, "routes"),
      "@utils": path.resolve(dirname, "utils"),
      "@typings": path.resolve(dirname, "typings"),
      "@root": dirname,
    },
  },
  externalsPresets: { node: true },
  // externals: [nodeExternals()],
};

module.exports = config;
