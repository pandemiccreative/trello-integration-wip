const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    app: path.join(PATHS.app, 'js', 'app.js')
  },
  output: {
    path: path.join(PATHS.build),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: 'pug'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.app, 'index.pug')
    })
  ]
};

var config;

switch(process.env.npm_lifecycle_event){
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map'
      },
      parts.setupLESS(PATHS.app),
      parts.setupJSON()
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },
      parts.setupLESS(PATHS.app),
      parts.setupJSON(),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
