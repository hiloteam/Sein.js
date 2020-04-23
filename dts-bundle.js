#!/usr/bin/env node
/**
 * @File   : dts-bundle.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/3/2018, 3:53:54 PM
 * @Description:
 */
const fs = require('fs');
const	path = require('path');
const dts = require('dts-bundle');
const rimraf = require('rimraf');
const package = require('./package.json');

const header = `/*! 
 * @license Sein.js v${package.version}
 * Copyright (c) 2018-present SeinJS Group.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;

function walk(dir, callback) {
	const files = fs.readdirSync(dir);
	files.forEach(file => {
		const filepath = path.join(dir, file);
		const stats = fs.statSync(filepath);
		callback(filepath, stats.isDirectory());
	});
}


dts.bundle({
	name: 'seinjs',
	main: 'lib/index.d.ts'
});

walk('./lib', (fp, isDir) => {
	if (isDir) {
		rimraf.sync(fp);
		return;
	}

	if (fp === 'lib/index.d.ts') {
		rimraf.sync(fp);
		return;
	}

	if (/\.js$/.test(fp)) {
		let content = fs.readFileSync(fp, {encoding: 'utf8'});
		content = content.replace(/\\n\s+/g, '\\n');
		fs.writeFileSync(fp, header + content);
	}
});

let res = header + fs.readFileSync('./lib/seinjs.d.ts', {encoding: 'utf8'}) + '\n\n';
res = res.replace(`declare module 'seinjs/index//hilo3d'`, `module 'hilo3d'`);
const hiloDTS = fs.readFileSync('./Hilo3d/types/index.d.ts', {encoding: 'utf8'})
.replace('export = hilo3d;', '')
.replace('export as namespace hilo3d;', '')
.replace('declare namespace hilo3d', "declare module 'hilo3d'");
let axiosDTS = fs.readFileSync('./node_modules/axios/index.d.ts', {encoding: 'utf8'})
.replace('export default Axios;', '');
axiosDTS = "declare module 'axios' {\n" + axiosDTS + '};\n';
res += hiloDTS;
res += axiosDTS;
fs.writeFileSync('./lib/seinjs.d.ts', res);
