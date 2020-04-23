/**
 * @File   : index.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 10/14/2019, 3:02:20 PM
 */

import * as React from 'react';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'ConeEmitter', cn: '锥形发射器'};
export {label, desc};

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
  />
);