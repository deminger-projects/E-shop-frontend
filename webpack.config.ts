import path from "path";

const config = {
  entry: "./src/index.js",
  devServer: { //da se udelat i jinak
    host: '0.0.0.0',
    disableHostCheck: true,
    allowedHosts: ['localhost', '.gitpod.io']
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