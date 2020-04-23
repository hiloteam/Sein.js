/**
 * @File   : webpack.prod.config.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-7-28 13:54:12
 * @Description: 
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outPath = path.resolve(__dirname, '../dist');

const commonConfig = require('./webpack.common.config.js');
const config = Object.assign({}, commonConfig, {
  entry: {
    main: path.resolve(__dirname, './index.tsx'),
    'react-packet': ['react', 'react-dom'],
    seinjs: [
      'seinjs',
      'seinjs-dom-hud',
      'seinjs-react-hud',
      'seinjs-debug-tools',
      'seinjs-camera-controls',
      'seinjs-gpu-particle-system',
      'seinjs-post-processing-system',
      'seinjs-gui'
    ]
  },

  output: {
    path: outPath,
    filename: '[name].[hash].js',
    publicPath: '/'
  }
});
config.plugins.push(
  new CleanWebpackPlugin(
    ['*'],
    {root: outPath}
  ),
  new CopyWebpackPlugin(
    [
      {
        from: path.resolve(__dirname, './assets'),
        to: path.resolve(__dirname, '../dist/assets')
      }
    ]
  ),
  new ExtractTextPlugin({
    filename: 'main.[hash].css',
    allChunks: true
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['seinjs', 'react-packet'],
    minChunks: 2
  })
);

module.exports = config;
