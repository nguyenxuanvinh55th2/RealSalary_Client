var path = require('path');
var webpack = require('webpack');

module.exports = {
  context:__dirname + '/app',
  entry: [
    'webpack-dev-server/client?http://localhost:4000',
    'webpack/hot/only-dev-server',
    __dirname + '/app/main'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude:/node_module/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'app')
    },
    { test: /\.json$/,
      loader: 'json'
    },
    {
      test: /\.less$/,
      loader: "style!css!less"
    }
  ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
         root: 'node_modules/',
   },
};
