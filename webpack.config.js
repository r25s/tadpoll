var vue = require('vue-loader')
var webpack = require('webpack')

module.exports = {
	entry: './client/main.js',
	output: {
		path:  __dirname + '/client_build',
		publicPath: 'client_build/',
		filename: 'build.js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
			//Chart: "chart.js"
			//"window.jQuery": "jquery",
			//"window.$": "jquery"
		})
	],
	module: {
		loaders: [
			{
				test: /\.scss|css$/,
				loaders: [
					'style',
					'css?sourceMap',
					'autoprefixer?browsers=last 2 versions',
					'sass?sourceMap'
				]
			},
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				// edit this for additional asset file types
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file?name=./build/images/[name].[ext]?[hash]'
			},
			{
				test: /\.js$/,
				// excluding some local linked packages.
				// for normal use cases only node_modules is needed.
				exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\/|vuex\//,
				loader: 'babel'
			},
			{
				test: /\.ttf$/,
				loader: 'url'
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
}

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