#!/usr/bin/env node
/**
 * @File   : tslintConfig.js
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2018-5-10 16:54:04
 * @Description: 
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  configuration: {
    rulesDirectory: path.resolve(__dirname, 'node_modules/tslint-microsoft-contrib'),
    configuration: JSON.parse(fs.readFileSync(path.resolve(__dirname, 'tslint.json')))
  },

  // enables type checked rules like 'for-in-array'
  // uses tsconfig.json from current working directory
  typeCheck: true,

  // can specify a custom config file relative to current directory
  // 'tslint-custom.json'
  configFile: false,

  // tslint errors are displayed by default as warnings
  // set emitErrors to true to display them as errors
  emitErrors: false,

  // tslint does not interrupt the compilation by default
  // if you want any file with tslint errors to fail
  // set failOnHint to true
  failOnHint: true,

  // name of your formatter (optional)
//  formatter: 'yourformatter',

  // path to directory containing formatter (optional)
//  formattersDirectory: 'node_modules/tslint-loader/formatters/',

  // These options are useful if you want to save output to files
  // for your continuous integration server
  fileOutput: {
    // The directory where each file's report is saved
    dir: './report/tslint',

    // The extension to use for each report's filename. Defaults to 'txt'
    ext: 'xml',

    // If true, all files are removed from the report directory at the beginning of run
    clean: true,

    // A string to include at the top of every report file.
    // Useful for some report formats.
    header: '<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="5.7">',

    // A string to include at the bottom of every report file.
    // Useful for some report formats.
    footer: '</checkstyle>'
  }
};
