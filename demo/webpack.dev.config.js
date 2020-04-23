/**
 * @File   : webpack.dev.config.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-7-28 13:54:12
 * @Description: 
 */
const webpack = require('webpack');
const path = require('path');

const commonConfig = require('./webpack.common.config.js');
const config = Object.assign({}, commonConfig, {
  devtool: 'source-map',

  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?/',
      'webpack/hot/dev-server',
      path.resolve(__dirname, './index.tsx')
    ]
  },

  output: {
    path: path.resolve(__dirname),
    filename: 'main.js',
    publicPath: '/'
  }
});

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }),
  new webpack.HotModuleReplacementPlugin()
);

module.exports = config;
