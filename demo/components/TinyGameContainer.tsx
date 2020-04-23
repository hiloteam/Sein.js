/**
 * @File   : TinyGameContainer.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 8:28:44 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import * as cx from 'classnames';

import {config} from '../pages/example/utils';
import ExampleContainer from './ExampleContainer';

export interface IPropTypes {
  title: {cn: string, en: string};
  desc: string;
  code: string;
  footDesc?: string;
  MainScript: Sein.TLevelScriptConstructor<Sein.LevelScriptActor>;
  MainGameMode?: Sein.TGameModeConstructor<Sein.GameModeActor>;
  onInit?(game: Sein.Game): void;
}

export default class TinyGameContainer extends React.Component<IPropTypes, any> {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private engine: Sein.Engine;

  public componentDidMount() {
    const canvas = this.canvas.current;

    const engine = this.engine = new Sein.Engine();
    const game = new Sein.Game(
      'demo-common-tiny-game',
      {
        canvas,
        clearColor: config.background,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        antialias: true,
        fragmentPrecision: 'highp'
      },
      Sein.StateActor
    );

    engine.addGame(game);

    game.addWorld('main', this.props.MainGameMode || Sein.GameModeActor, this.props.MainScript);

    document.addEventListener('appPause', () => game.pause());
    document.addEventListener('appResume', () => game.resume());
    document.addEventListener('pause', () => game.pause());
    document.addEventListener('resume', () => game.resume());

    if (this.props.onInit) {
      this.props.onInit(game);
    }

    game.start();

    this.forceUpdate();
  }

  public componentWillUnmount() {
    this.engine.destroy();
  }

  public render() {
    const {title, desc, code, footDesc} = this.props;

    return (
      <ExampleContainer
        title={title}
        code={code}
        desc={desc}
        footDesc={footDesc}
      >
        <canvas
          className={cx('example-game-canvas')}
          ref={this.canvas}
        />
        {this.props.children}
      </ExampleContainer>
    );
  }
}
