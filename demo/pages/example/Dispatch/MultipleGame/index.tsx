/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:52:33 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import * as cx from 'classnames';

import ExampleContainer from 'components/ExampleContainer';
import main from './main';

const code = require('!raw-loader!./main.ts');
const desc = require('./readme.md');

const label = {en: 'MultipleGame', cn: '多游戏并行'};
export {label, desc};

export class Component extends React.PureComponent {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private canvas2: React.RefObject<HTMLCanvasElement> = React.createRef();
  private engine: Sein.Engine;

  public componentDidMount() {
    this.engine = main(this.canvas.current, this.canvas2.current);
  }

  public componentWillUnmount() {
    this.engine.destroy();
  }

  public render() {
    return (
      <ExampleContainer
        title={label}
        code={code}
        desc={desc}
      >
        {
          [
            <canvas
              key={1}
              className={cx('example-game-canvas')}
              ref={this.canvas}
            />,
            <canvas
              key={2}
              style={{marginTop: 4}}
              className={cx('example-game-canvas')}
              ref={this.canvas2}
            />
          ]
        }
      </ExampleContainer>
    );
  }
}
