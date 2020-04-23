/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import Slider from 'hana-ui/dist/seeds/Slider';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'Volume', cn: '音量控制'};
export {label, desc};

let game: Sein.Game;

function getSlider(name: string, defaultValue: number) {
  return (
    <div style={{marginTop: 8}}>
      <p style={{fontSize: 14}}>{name}</p>
      <Slider
        min={0}
        max={100}
        showValue={false}
        defaultValue={defaultValue}
        size={'small'}
        onChange={value => game.event.trigger('AudioControl', {name, value: value / 100})}
      />
    </div>
  );
}

export const Component = () => (
  <TinyGameContainer
    title={label}
    code={code}
    desc={desc}
    MainScript={MainScript}
    onInit={g => {
      game = g;
      game.event.register('AudioControl');
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '12px 24px',
        background: 'rgba(255, 255, 255, .5)'
      }}
    >
      {getSlider('System', 100)}
      {getSlider('Listener', 100)}
      {getSlider('Source1', 50)}
      {getSlider('Source2', 50)}
    </div>
  </TinyGameContainer>
);
