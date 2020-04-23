/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'GlTF', cn: 'GlTF'};
export {label, desc};

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
  />
);
