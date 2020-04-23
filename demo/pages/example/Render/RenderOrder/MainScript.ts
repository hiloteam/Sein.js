/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.addActor('red', Sein.BSPSphereActor, {
      radius: 1,
      position: new Sein.Vector3(0, 0, -3),
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0), renderOrder: 0, depthTest: false})
    });

    world.addActor('green', Sein.BSPSphereActor, {
      radius: 1,
      position: new Sein.Vector3(0, 0, 0),
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 1, 0), renderOrder: 1, depthTest: false})
    });

    world.addActor('blue', Sein.BSPSphereActor, {
      radius: 1,
      position: new Sein.Vector3(0, 0, 3),
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 0, 1), renderOrder: 2, depthTest: false})
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 5, 10)});
  }
}
