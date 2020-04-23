/**
 * @File   : main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:52:18 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {config, loadSein, createSein} from '../../utils';

class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
      aspect: game.screenAspect,
      fov: 60,
      near: 0.01,
      far: 100
    });
    camera.transform.setPosition(0, 10, -20);
    camera.root.lookAt(new Sein.Vector3(0, 10, 0));

    world.addActor('amLight', Sein.AmbientLightActor, {
      amount: .5
    });
    world.addActor('dirLight1', Sein.DirectionalLightActor, {
      direction: new Sein.Vector3(0, -1, 1),
      amount: 2
    });
    world.addActor('dirLight2', Sein.DirectionalLightActor, {
      direction: new Sein.Vector3(0, -1, -1),
      amount: 2
    });

    createSein(game);
  }

  public onUpdate(d) {
    const sein = Sein.findActorByName(this.getWorld(), 'Sein');
    sein.transform.rotate(sein.transform.upVector, .01);
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
