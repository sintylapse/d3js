var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./client/main.js",
  output: {
    path: __dirname + "/public/build/",
    publicPath: "build/",
    filename: "boundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      { 
        test: /\.js$/, 
        exclude: [/node_modules/, /public/],
        loader: "babel-loader",
        query: {
          presets: ['es2015', 'react']
          // presets: ['es2015', 'react', 'react-hmre']
        }
      },
      { 
        test: /\.styl$/, 
        loader: "style-loader!css-loader?minimize!stylus",
        exclude: [/node_modules/, /public/]
      }
    ]
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};