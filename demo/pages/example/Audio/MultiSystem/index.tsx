/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import Slider from 'hana-ui/dist/seeds/Slider';
import {Button} from 'hana-ui/dist/seeds/Button';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'MultiSystem', cn: '多个系统'};
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
      <Button style={{marginTop: 10}} onClick={() => game.event.trigger('AudioSwitch', {name})}>Pause/Resume</Button>
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
      {getSlider('BGM', 100)}
      {getSlider('Sound', 100)}
    </div>
  </TinyGameContainer>
);
