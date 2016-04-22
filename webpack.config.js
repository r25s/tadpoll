const path = require('path');
const vue = require('vue-loader');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
	main: path.resolve(__dirname, 'client'),
	build: path.resolve(__dirname, 'client_build')
};

module.exports = {
	entry: {
		main: PATHS.main
	},
	output: {
		path: PATHS.build,
		filename: 'build.js',
		publicPath: 'client_build/'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new ExtractTextPlugin('styles.css')
	],
	module: {
		loaders: [
			{
				test: /\.scss|css$/,
				loader: ExtractTextPlugin.extract(
					'css-loader?sourceMap' +
					'!autoprefixer-loader?browsers=last 2 versions' +
					'!sass-loader?sourceMap'
				),
				include: PATHS.main
			},
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.ttf|.eot|.woff|webfont.svg$/,
				loader: 'url'
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				exclude: /webfont.svg$/,
				loader: 'file?name=' + PATHS.build + '/images/[name].[ext]?[hash]'
			},
			{
				test: /\.js$/,
				// excluding some local linked packages.
				// for normal use cases only node_modules is needed.
				exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\/|vuex\//,
				loader: 'babel'
			},
			{
				test: /Chart.min.js$/,
				loader: 'script'
			}
		]
	},
	babel: {
		presets: ['es2015'],
		plugins: ['transform-runtime']	
	}
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
} else {
  module.exports.devtool = '#source-map'
}