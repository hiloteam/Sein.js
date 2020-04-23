/**
 * @File   : index.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/21/2019, 3:54:03 PM
 */

import * as React from 'react';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.tsx');
const desc = require('./readme.md');

const label = {en: 'BasicEvent', cn: '基础事件'};
export {label, desc};

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
  />
);