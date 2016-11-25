const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const compiler = webpack(config);
new webpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  hot:true,
  historyApiFallback:true
}).listen(4000, '0.0.0.0', function (err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('App listening at http://localhost:4000');
});
