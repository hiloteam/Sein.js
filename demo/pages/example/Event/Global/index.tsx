/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:42:00 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import * as cx from 'classnames';

import ExampleContainer from 'components/ExampleContainer';
import main from './main';

const code = require('!raw-loader!./main.ts');
const desc = require('./readme.md');

const label = {en: 'Global', cn: '全局事件'};
export {label, desc};

export class Component extends React.PureComponent {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private engine: Sein.Engine;

  public componentDidMount() {
    const canvas = this.canvas.current;

    this.engine = main(canvas);
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
        <canvas
          className={cx('example-game-canvas')}
          ref={this.canvas}
        />
      </ExampleContainer>
    );
  }
}
