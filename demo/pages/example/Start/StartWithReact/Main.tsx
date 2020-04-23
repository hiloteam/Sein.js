/**
 * @File   : Main.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/3/2018, 3:04:39 PM
 * @Description:
 */
import * as React from 'react';
import * as Sein from 'seinjs';
import * as cx from 'classnames';
import {config, loadSein, createDefaultCamera, createDefaultLights, createSein} from '../../utils';

class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {withController: false});
    createDefaultLights(game);
    createSein(game);
  }

  public onUpdate() {
    const sein = Sein.findActorByName(this.getWorld(), 'Sein');
    sein.transform.rotate(sein.transform.upVector, .01);
  }
}

export default class Main extends React.PureComponent {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private engine: Sein.Engine;

  public async componentDidMount() {
    const canvas = this.canvas.current;

    this.engine = new Sein.Engine();

    const game = new Sein.Game(
      'intro-game',
      {
        canvas,
        clearColor: config.background,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        antialias: true
      }
    );

    this.engine.addGame(game);

    game.addWorld('main', Sein.GameModeActor, MainScript);

    await game.start();
  }

  public componentWillUnmount() {
    this.engine.destroy();
  }

  public render() {
    return (
      <canvas
        className={cx('example-game-canvas')}
        ref={this.canvas}
      />
    );
  }
}
