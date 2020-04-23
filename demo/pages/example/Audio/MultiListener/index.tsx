/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import {Radio, RadioGroup} from 'hana-ui/dist/seeds/Radio';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'MultiListener', cn: '多个监听器'};
export {label, desc};

export class Component extends React.Component {
  public state = {
    listener: 1
  };

  private game: Sein.Game;

  public render() {
    return (
      <TinyGameContainer
          title={label}
          code={code}
          desc={desc}
          MainScript={MainScript}
          onInit={game => {
            this.game = game;
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
            <RadioGroup
              value={this.state.listener}
              onChange={value => {
                this.setState({listener: value});
                this.game.event.trigger('AudioControl', value);
              }}
            >
              <Radio label={'监听器1'} value={1} />
              <Radio label={'监听器1'} value={2} />
            </RadioGroup>
          </div>
        </TinyGameContainer>
    )
  }
}
