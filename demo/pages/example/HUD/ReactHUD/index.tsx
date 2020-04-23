/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';

import ExampleContainer from 'components/ExampleContainer';
import Main from './Main';

const code = require('!raw-loader!./Main.tsx');
const desc = require('./readme.md');

const label = {en: 'ReactHUD', cn: '基于React的HUD'};
export {label, desc};

export const Component = () => (
  <ExampleContainer
    title={label}
    code={code}
    desc={desc}
  >
    <Main />
  </ExampleContainer>
);
