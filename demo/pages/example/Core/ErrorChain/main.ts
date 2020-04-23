/**
 * @File   : main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:52:18 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {config, loadSein, createSein, createDefaultCamera, createDefaultLights} from '../../utils';

interface IStateTypes extends Sein.ISceneComponentState {
  info: string;
}

class CustomComponent extends Sein.Component<IStateTypes> {
  private emitted: boolean = false;

  public onError(error: Sein.BaseException, details?: any) {
    console.log('Component', error, details);
  }

  public onDestroy() {
    if (this.emitted) {
      return;
    }

    this.emitted = true;
    throw new Error('Just emit an error, it could be handled from component to top level game.');
  }
}

class CustomActor extends Sein.SceneActor<IStateTypes> {
  public onError(error: Sein.BaseException, details?: any) {
    console.log('Actor', error, details);
  }
}

class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    console.log('onCreate(LevelScript)');
    const game = this.getGame();

    createDefaultCamera(game);
    createDefaultLights(game);
    createSein(game);

    const actor = game.world.addActor('customActor', CustomActor, {info: 'Hello Actor !'});
    actor.addComponent('customComponent', CustomComponent, {info: 'Hello Component !'});

    actor.removeComponent('customComponent');

    setTimeout(() => game.switchWorld('end'), 1000);
  }

  public onError(error: Sein.BaseException, details?: any) {
    console.log('LevelScript', error, details);
  }
}

class MainGameMode extends Sein.GameModeActor {
  public onError(error: Sein.BaseException, details?: any) {
    console.log('GameMode', error, details);
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

  game.addWorld('main', MainGameMode, MainScript);
  game.addWorld('end', Sein.GameModeActor, Sein.LevelScriptActor);

  game.start();

  return engine;
}
