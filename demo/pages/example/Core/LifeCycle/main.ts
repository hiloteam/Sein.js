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
  public onInit(initState: IStateTypes) {
    console.log('OnInit(Component)', initState);
  }

  public onAdd(initState: IStateTypes) {
    console.log('OnAdd(Component)', initState);
  }

  public onUpdate() {
    console.log('onUpdate(Component)');
  }

  public onDestroy() {
    console.log('onDestroy(Component)');
  }
}

class CustomActor extends Sein.SceneActor<IStateTypes> {
  public onInit(initState: IStateTypes) {
    console.log('OnInit(Actor)', initState);
  }

  public onAdd(initState: IStateTypes) {
    console.log('OnAdd(Actor)', initState);
  }

  public onUpdate() {
    console.log('onUpdate(Actor)');
  }

  public onDestroy() {
    console.log('onDestroy(Actor)');
  }
}

class MainScript extends Sein.LevelScriptActor {
  public async onLogin() {
    console.log('onLogin(LevelScript)');
  }

  public onInit() {
    console.log('OnInit(LevelScript)');
  }

  public onAdd() {
    console.log('onAdd(LevelScript)');
  }

  public onPreload() {
    console.log('onPreload(LevelScript)');
    loadSein(this.getGame());
  }

  public onLoading(state) {
    console.log('onLoading(LevelScript)', state);
  }

  public onCreate() {
    console.log('onCreate(LevelScript)');
    const game = this.getGame();

    createDefaultCamera(game);
    createDefaultLights(game);
    createSein(game);

    const actor = game.world.addActor('customActor', CustomActor, {info: 'Hello Actor !'});
    actor.addComponent('customComponent', CustomComponent, {info: 'Hello Component !'});

    setTimeout(() => game.switchWorld('end'), 1000);
  }

  public onUpdate() {
    console.log('onUpdate(LevelScript)');
  }

  public onDestroy() {
    console.log('onDestroy(LevelScript)');
  }
}

class MainGameMode extends Sein.GameModeActor {
  public async onLogin() {
    console.log('onLogin(GameMode)');
  }

  public onInit() {
    console.log('onInit(GameMode)');
  }

  public onAdd() {
    console.log('onAdd(GameMode)');
  }

  public onCreatePlayers() {
    console.log('onCreatePlayers(GameMode)');
    super.onCreatePlayers();
  }

  public onUpdate() {
    console.log('onUpdate(GameMode)');
  }

  public onDestroyPlayers() {
    console.log('onDestroyPlayers(GameMode)');
  }

  public onDestroy() {
    console.log('onDestroy(GameMode)');
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
