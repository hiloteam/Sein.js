#!/usr/bin/env node
/**
 * @File   : webpack.common.config.js.js
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 1/30/2019, 11:17:41 AM
 * @Description:
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      components: path.resolve(__dirname, './components'),
      seinjs: path.resolve(__dirname, '../src'),
      'seinjs-dom-hud': path.resolve(__dirname, '../extensions/DomHUD/src'),
      'seinjs-react-hud': path.resolve(__dirname, '../extensions/ReactHUD/src'),
      'seinjs-debug-tools': path.resolve(__dirname, '../extensions/DebugTools/src'),
      'seinjs-camera-controls': path.resolve(__dirname, '../extensions/CameraControls/src'),
      'seinjs-gpu-particle-system': path.resolve(__dirname, '../extensions/GPUParticleSystem/src'),
      'seinjs-post-processing-system': path.resolve(__dirname, '../extensions/PostProcessingSystem/src'),
      'seinjs-audio': path.resolve(__dirname, '../extensions/Audio/src'),
      'seinjs-gui': path.resolve(__dirname, '../extensions/GUI/src'),
      'hilo3d':  path.resolve(__dirname, '../Hilo3d/seinjs-build/Hilo3d.js'),
      'seinjs-materials': path.resolve(__dirname, '../materials')
    }
  },

  externals: {
    'fs': true,
    'path': true,
  },
  
  module: {
    noParse: [
      /benchmark/
    ],
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'react-hot-loader/webpack'
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.resolve(__dirname, './tsconfig.json'),
              transpileOnly: true
            }
          },
          // {
          //   loader: 'tslint-loader',
          //   query: {
          //     configFile: path.resolve(__dirname, './tslintConfig.js')
          //   }
          // }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, './config.scss')
            }
          }
        ]
      },
      {
        test: /\.(md|glsl)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 15000
          }
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html')
    })
  ]
};
