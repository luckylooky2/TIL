const path = require("path");
const nodeExternals = require("webpack-node-externals");

const configs = [
  // browser.js에는 App.jsx, Todo.jsx, fetch 등의 자바스크립트 코드가 포함되어 있다.
  {
    entry: {
      browser: "./index.js",
    },
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
          exclude: path.join(__dirname, "node_modules"),
        },
      ],
    },
    // 특정 모듈 제외 => CDN을 이용하여 가져오기 위해
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
  {
    entry: {
      server: "./server.js",
    },
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    devtool: "source-map",
    module: {
      rules: [
        { test: /\.html$/, loader: "raw-loader" },
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
          exclude: path.join(__dirname, "node_modules"),
        },
      ],
    },
    target: "node",
    externals: [nodeExternals()],
  },
];

module.exports = configs;
