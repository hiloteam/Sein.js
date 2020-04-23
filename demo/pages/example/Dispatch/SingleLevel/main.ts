/**
 * @File   : main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:52:18 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {config, loadSein, createSein, createDefaultCamera, createDefaultLights} from '../../utils';

class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game);
    createDefaultLights(game);
    createSein(game);
    const sein = Sein.findActorByName(this.getWorld(), 'Sein');
    sein.onUpdate = () => sein.transform.rotate(sein.transform.upVector, .01);
  }
}

export default function main(canvas: HTMLCanvasElement): Sein.Engine {
  const engine = new Sein.Engine();

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

  engine.addGame(game);

  game.addWorld('main', Sein.GameModeActor, MainScript);

  game.start();

  return engine;
}
