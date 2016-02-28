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
		preLoaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'jshint'
		}],
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015']
			}
		}, {
			test: /\.scss$/,
			exclude: /node_modules/,
			loaders: ["style", "css", "sass"]
		}]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: './scripts/[name].js'
	},
	plugins: [
		new CopyWebpackPlugin([{
			from: 'images/icons/fbvd-*.png'
		}, {
			from: 'manifest.json'
		}]),
		new CleanWebpackPlugin(['dist'], {
			verbose: true
		})
	]
};
