/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:52:33 PM
 * @Description:
 */
import * as React from 'react';

import ExampleContainer from 'components/ExampleContainer';
import Main from './Main';

const code = require('!raw-loader!./Main.tsx');
const desc = require('./readme.md');

const label = {en: 'StartWithReact', cn: '使用React开始'};
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
