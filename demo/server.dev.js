#!/usr/bin/env node
/**
 * @File   : server.dev.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-7-28 13:54:12
 * @Description:
 */
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.dev.config');
const express = require('express');
const app = new express();
const port = 8888;
const proxyPort = port + 1;

app.use('/assets',
  express.static(path.resolve(__dirname, './assets'))
);

const devServer = () => {
  const server = new WebpackDevServer(webpack(config), {
    compress: true,
    progress: true,
    hot: true,
    open: true,
    publicPath: config.output.publicPath,
    contentBase: path.resolve(__dirname),
    disableHostCheck: true,
    // watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: false,
    overlay: true,
    historyApiFallback: {
      disableDotRule: true
    },
    proxy: [{
      context: ['/assets'],
      target: `http://localhost:${proxyPort}`
    }]
  });

  server.listen(port, '0.0.0.0', (error) => {
    if (error) {
      console.log('webpack dev server failed', error);
    }
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  });
}

app.listen(proxyPort, '0.0.0.0', function(error) {
  if (error) {
    console.error(`Start proxy server error.`);
  } else {
    console.info('Proxy server for assets is started...');
  }
});

devServer();
