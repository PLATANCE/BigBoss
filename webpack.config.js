/* eslint max-len: ["error", { "ignoreComments": true, "code": 200 }] */

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,                                   // input path
  devtool: 'inline-source-map',
  entry: [                                              // webpack will start consuming from these file(s)
    './app/app.js',
  ],
  output: {
    path: path.join(__dirname, 'public/build'),                // output path
    filename: 'build.js',                             // compiled js (single file only)
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],  // along the way, subsequent file(s) to be consumed by webpack
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules'),
    ],
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-1'],
        },
      }, {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style',
        'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap'),
      },
    ],
  },
  postcss: [autoprefixer],
  plugins: [
    new ExtractTextPlugin('flexBox.css', { allChunks: true }),  // compiled css (single file only)
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
