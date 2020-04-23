/**
 * @File   : index.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/22/2019, 11:50:29 AM
 */

import * as React from 'react';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.tsx');
const desc = require('./readme.md');

const label = {en: 'Label and Button', cn: '标签和按钮'};
export {label, desc};

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
  />
);