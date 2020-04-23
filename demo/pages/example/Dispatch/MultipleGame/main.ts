/**
 * @File   : main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:52:18 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {config, loadSein, createSein, createDefaultCamera, createDefaultLights} from '../../utils';

class PreScript extends Sein.LevelScriptActor {
  private time: number = 0;

  public onPreload() {
    this.getGame().resource.load({type: 'Texture', name: 'logo.jpg', url: '/assets/paradise.jpg'});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const logo = world.addActor('logo', Sein.SpriteActor, {
      width: 4, height: 4,
      texture: game.resource.get<'Texture'>('logo.jpg'),
      position: new Sein.Vector3(8, 16, 0)
    });
    // make inheritable
    logo.persistent = true;

    world.addActor('logo2', Sein.SpriteActor, {
      width: 4, height: 4,
      texture: game.resource.get<'Texture'>('logo.jpg'),
      position: new Sein.Vector3(-8, 16, 0)
    });

    // cameras could be inheritable default
    createDefaultCamera(game);
  }

  public onUpdate(delta: number) {
    this.time += delta;

    if (this.time >= 1500) {
      this.getGame().switchLevel('main');
    }
  }
}

class MainScript extends Sein.LevelScriptActor {
  // public onPreload() {
  //   loadSein(this.getGame());
  // }

  // public onCreate() {
  //   const game = this.getGame();

  //   createDefaultLights(game);
  //   createSein(game);
  // }

  // public onUpdate(delta: number) {
  //   const world = this.getWorld();

  //   const sein = Sein.findActorByName(world, 'Sein');
  //   sein.onUpdate = () => sein.transform.rotate(sein.transform.upVector, .01);
  // }
}

export default function main(canvas: HTMLCanvasElement, canvas2: HTMLCanvasElement): Sein.Engine {
  const engine = new Sein.Engine();

  const game1 = new Sein.Game(
    'game1',
    {
      canvas,
      clearColor: config.background,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    }
  );
  engine.addGame(game1);
  game1.addWorld('main', Sein.GameModeActor, PreScript);
  game1.addLevel('main', 'main', MainScript);

  const game2 = new Sein.Game(
    'game2',
    {
      canvas: canvas2,
      clearColor: config.background,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    }
  );
  engine.addGame(game2);
  game2.addWorld('main', Sein.GameModeActor, PreScript);
  game2.addLevel('main', 'main', MainScript);

  game1.start();
  game2.start();

  return engine;
}
