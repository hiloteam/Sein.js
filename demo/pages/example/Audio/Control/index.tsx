/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import {Checkbox} from 'hana-ui/dist/seeds/Checkbox';
import {Button, ButtonGroup} from 'hana-ui/dist/seeds/Button';
import Slider from 'hana-ui/dist/seeds/Slider';

import TinyGameContainer from 'components/TinyGameContainer';
import MainScript from './MainScript';

const code = require('!raw-loader!./MainScript.ts');
const desc = require('./readme.md');

const label = {en: 'Control', cn: '播放控制'};
export {label, desc};

class Details extends React.PureComponent<{game: Sein.Game}> {
  public state = {
    paused: true,
    stopt: true,
    currentTime: 0,
    duration: 0,
    range: [0, 0],
    loop: true
  };

  public componentWillReceiveProps(nextProps) {
    if (nextProps.game) {
      nextProps.game.event.add('AudioDetails', this.handleChangeAudio);
    }
  }

  private handleChangeAudio = (value: {
    paused: boolean,
    stopt: boolean,
    currentTime: number,
    duration: number,
    range: number[],
    loop: boolean
  }) => {
    this.setState(value);
  }

  public render() {
    const {paused, stopt, currentTime, duration, range, loop} = this.state;

    return (
      <div>
        <p>Paused: {paused.toString()}</p>
        <p>Stopt: {stopt.toString()}</p>
        <p>Loop: {loop.toString()}</p>
        <p>Duration: {duration.toFixed(2)}</p>
        <p>Range: {range[0].toFixed(2)} ~ {range[1].toFixed(2)}</p>
        <p>CurrentTime: {currentTime.toFixed(2)}</p>
      </div>
    );
  }
}

export class Component extends React.Component {
  public state = {
    game: null,
    loop: true,
    start: 0,
    end: 240
  };

  private handleSendControl = (type: string) => {
    this.state.game.event.trigger('AudioControl', {type, value: {
      loop: this.state.loop,
      range: [this.state.start, this.state.end]
    }});
  }

  public render() {
    return (
      <TinyGameContainer
          title={label}
          code={code}
          desc={desc}
          MainScript={MainScript}
          onInit={game => {
            game.event.register('AudioControl');
            game.event.register('AudioDetails');
            this.setState({game});
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
            <div>
              <Checkbox
                label={'Loop'}
                checked={this.state.loop}
                onChange={(e, value) => this.setState({loop: value})}
              />
              <p style={{fontSize: 16, margin: 0}}>Range</p>
              <Slider
                min={0}
                max={this.state.end}
                value={this.state.start}
                size={'small'}
                onChange={value => this.setState({start: value})}
              />
              <Slider
                min={this.state.start}
                max={240}
                value={this.state.end}
                size={'small'}
                onChange={value => this.setState({end: value})}
              />
            </div>
            <ButtonGroup style={{margin: '12px 0'}}>
              <Button
                style={{margin: 4}}
                type={'primary'}
                onClick={() => this.handleSendControl('Play')}
              >
                Play
              </Button>
              <Button
                style={{margin: 4}}
                type={'primary'}
                onClick={() => this.handleSendControl('Pause')}
              >
                Pause
              </Button>
              <Button
                style={{margin: 4}}              
                type={'primary'}
                onClick={() => this.handleSendControl('Resume')}
              >
                Resume
              </Button>
              <Button
                style={{margin: 4}}
                type={'primary'}
                onClick={() => this.handleSendControl('Stop')}
              >
                Stop
              </Button>
            </ButtonGroup>
            <Details game={this.state.game} />
          </div>
        </TinyGameContainer>
    )
  }
}
