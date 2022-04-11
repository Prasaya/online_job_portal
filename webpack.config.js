/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const dirname = __dirname;

console.log("dirname", dirname, path.resolve("."));
const config = {
  // @ts-ignore
  mode: process.env.NODE_ENV || "development",
  entry: "./packages/api/bin/www",
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
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@middleware": path.resolve(dirname, "packages/api/middleware"),
      "@models": path.resolve(dirname, "packages/api/models"),
      "@routes": path.resolve(dirname, "packages/api/routes"),
      "@utils": path.resolve(dirname, "packages/api/utils"),
      "@typings": path.resolve(dirname, "packages/api/typings"),
      "@root": path.resolve(dirname, "packages/api"),
    },
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
};

module.exports = config;
