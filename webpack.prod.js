const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    module: {
        rules: [{
            test: /\.scss$/,
            use: [  {
							loader: 'file-loader',
							options: {
								name: '[name].css',
								outputPath: 'assets/css/'
							}
						},
						{
							loader: 'extract-loader'
						},
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader'
						}],
						
            },
            
            {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
              'file-loader'
            ]
        },
        {
            test: /\.css$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }]
        }]
        },
        
        plugins: [
  new UglifyJSPlugin({
    uglifyOptions: {
      ecma: 8,
      warnings: false,
      }})]
});
