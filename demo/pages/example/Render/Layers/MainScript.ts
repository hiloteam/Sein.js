/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

enum ELayers {
  r = 1,
  g = 2,
  b = 3
}

function generateRandomVec3() {
  return new Sein.Vector3(
    10 - Math.random() * 20,
    10 - Math.random() * 20,
    10 - Math.random() * 20
  );
}

export default class MainScript extends Sein.LevelScriptActor {
  private escape: number = 0;
  private count: number = 0;
  private camera: Sein.PerspectiveCameraActor;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.enableLayers = true;

    for (let index = 0; index < 10; index += 1) {
      const red = world.addActor('red', Sein.BSPSphereActor, {
        radius: 1, material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0)}),
        position: generateRandomVec3()
      });
      red.layers.set(ELayers.r);

      const green = world.addActor('green', Sein.BSPSphereActor, {
        radius: 1, material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 1, 0)}),
        position: generateRandomVec3()
      });
      green.layers.set(ELayers.g);

      const blue = world.addActor('blue', Sein.BSPSphereActor, {
        radius: 1, material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 0, 1)}),
        position: generateRandomVec3()
      });
      blue.layers.set(ELayers.b);
    }

    createDefaultLights(game);
    this.camera = createDefaultCamera(game, {
      target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, -20)
    });
  }

  public onUpdate(delta: number) {
    this.escape += delta;

    if (this.escape >= 2000) {
      this.camera.layers.set((this.count % 3) + 1);
      this.count += 1;
      this.escape = 0;
    }
  }
}
