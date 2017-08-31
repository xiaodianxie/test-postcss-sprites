const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const cwd = (...args) => path.join(__dirname, ...args) 

module.exports = {
	entry: cwd('src/index.js'),
	output: {
		path: cwd('dest'),
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.(png|jpg|gif)$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 2,
					name: '[name].[ext]'
				}
			}]
		},{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader'
				}, {
					loader: 'postcss-loader',
					options:{
						config: cwd('./postcss.config.js')
					}
				}]
			})
		}]
	},
	plugins: [new htmlWebpackPlugin({
		filename: `index.html`,
		template: 'swig-loader!' + path.join(__dirname, 'src/index.swig')
	}), new ExtractTextPlugin({ filename: '[name].css', disable: false, allChunks: true })]
}