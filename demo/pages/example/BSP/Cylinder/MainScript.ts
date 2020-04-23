/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {createDefaultLights, createDefaultCamera, config} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const box = world.addActor('cylinder', Sein.BSPCylinderActor, {
      radiusTop: 1, radiusBottom: 2, height: 2, radialSegments: 16,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      })
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: box, position: new Sein.Vector3(0, 0, 6)});
  }
}
