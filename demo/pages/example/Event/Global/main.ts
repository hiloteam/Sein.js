/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
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

    setTimeout(() => game.switchWorld('end'), 1000);
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
  game.addWorld('end', Sein.GameModeActor, Sein.LevelScriptActor);

  game.event.add('Resize', args => console.log('Resize', args));
  game.event.add('GameDidInit', args => console.log('GameDidInit', args));
  game.event.add('GameDidStart', args => console.log('GameDidStart', args));
  game.event.add('GameWillDestroy', args => console.log('GameWillDestroy', args));
  game.event.add('WorldDidInit', args => console.log('WorldDidInit', args));
  game.event.add('WorldDidCreatePlayers', args => console.log('WorldDidCreatePlayers', args));
  game.event.add('WorldWillDestroy', args => console.log('WorldWillDestroy', args));
  game.event.add('LevelDidInit', args => console.log('LevelDidInit', args));
  game.event.add('LevelWillPreload', args => console.log('LevelWillPreload', args));
  game.event.add('LevelIsPreloading', args => console.log('LevelIsPreloading', args));
  game.event.add('LevelDidPreload', args => console.log('LevelDidPreload', args));
  game.event.add('LevelDidCreateActors', args => console.log('LevelDidCreateActors', args));
  game.event.add('LevelWillDestroy', args => console.log('LevelWillDestroy', args));

  game.start();

  return engine;
}
