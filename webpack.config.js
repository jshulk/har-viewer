var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	entry: {
		app: ['./src/app.jsx']
	},
	output: {
		path: "./build",
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style!' + 'css?sourceMap'
			},
			{
				test: /\.scss$/,
				loader: 'style!' + 'css?sourceMap' + '!sass?sourceMap'
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader?optional[]=runtime'
			},
			{
                test: /\.(svg|ttf|woff|woff2|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader"
            },
             {
                test: /\.(json)$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "HAR viewer(React deep dive)"
		})
	],
	devtool: 'source-map'
};