/* eslint-disable @typescript-eslint/no-var-requires */
const path =require("path");
const nodeExternals =require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin");

const {
  NODE_ENV = "production",
} = process.env;

module.exports = {
  entry: "./src/server.ts",
  mode: NODE_ENV,
  target: "node",
  watch: NODE_ENV === "development",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "server.js"
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ["npm run watch-node"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          "ts-loader"
        ]
      }
    ]
  }
};

