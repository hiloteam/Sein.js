/**
 * @File   : index.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 9/23/2019, 7:16:53 PM
 */

import * as React from 'react';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.tsx');
const desc = require('./readme.md');

const label = {en: 'BitmapFont', cn: '自定义字体'};
export {label, desc};

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
  />
);