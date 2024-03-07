import path from "path";
import { Configuration } from "webpack";

const config = {
  entry: "./src/index.js",
  devServer: {
    disableHostCheck: true
  },
  mode: "development",
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.[tj]sx?$/,
        loader: "babel-loader"
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist")
  },
  plugins: [],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }
};

export default config;