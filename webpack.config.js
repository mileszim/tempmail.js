const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = [
  {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "tempmail.node.js"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [["env", { "targets": { "node": "6.10" } }]]
            }
          }
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(['dist'])
    ]
  },
  {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "tempmail.js"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [["env", { "targets": { "browsers": ["> 1%", "last 2 versions"] } }]]
            }
          }
        }
      ]
    }
  },
  {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "tempmail.min.js"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [["env", { "targets": { "browsers": ["> 1%", "last 2 versions"] } }]]
            }
          }
        }
      ]
    },

    plugins: [
      new MinifyPlugin()
    ]
  }
];
