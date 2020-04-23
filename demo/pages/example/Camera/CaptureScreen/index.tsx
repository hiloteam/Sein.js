/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'CaptureScreen', cn: '截取画布'};
export {label, desc};

let game: Sein.Game;

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
    onInit={g => {
      game = g;
      game.event.register('Capture');
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: 8
      }}
    >
      <div
        style={{
          padding: 12,
          fontSize: 20,
          background: '#fff',
          cursor: 'pointer'
        }}
        onClick={() => game.event.trigger('Capture')}
      >
        First Capture Screen
      </div>
      <a
        target={'_blank'}
        id={'link-for-download'}
        href={''}
        download={'screen-shot.png'}
        style={{
          display: 'block',
          padding: 12,
          fontSize: 16,
          background: '#fff',
          marginTop: 4
        }}
      >
        Then click for download
      </a>
    </div>
  </TinyGameContainer>
);
