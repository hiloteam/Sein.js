/**
 * @File   : gen-doc.js
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 1/31/2019, 10:24:56 AM
 * @Description:
 */
const typedoc = require('typedoc');
const path = require('path');
const fs = require('fs');

const sources = [
  path.resolve(__dirname, './src')
];

const options = {
  module: 'commonjs',
  target: 'es5',
  exclude: '**/node_modules/**/*.*',
  experimentalDecorators: true,
  excludeExternals: true,
  out: path.resolve(__dirname, './demo/assets/documents'),
  mode: 'file',
  excludePrivate: true,
  excludeProtected: true,
  tsconfig: path.resolve(__dirname, './src/tsconfig.json'),
  // theme: 'markdown',
  // mdEngine: 'github',
  plugin: [
    // require.resolve('typedoc-plugin-markdown'),
    // require.resolve('typedoc-plugin-no-inherit'),
    // require.resolve('./demo/typedoc-indexes-plugin')
  ]
};

const typedocApp = new typedoc.Application(options);
const src = typedocApp.expandInputFiles(sources);
const project = typedocApp.convert(src);

if (project) {
  typedocApp.generateDocs(project, options.out);
}
