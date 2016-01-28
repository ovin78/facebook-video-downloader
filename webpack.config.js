var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    background: './scripts/background.js',
    content: './scripts/content.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './scripts/[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './images/fbvd-*.png'
    }, {
      from: './manifest.json'
    }]),
    new CleanWebpackPlugin(['dist'], {
      verbose: true
    })
  ]
};
