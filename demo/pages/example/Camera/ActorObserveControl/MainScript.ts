/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {loadSein, createSein, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
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
    camera.transform.y = 10;
    camera.transform.z = -20;
    camera.transform.lookAt(new Sein.Vector3(0, 10, 0));

    createDefaultLights(game);
    createSein(game);

    Sein.findActorByName(world, 'Sein').addComponent('control', Sein.CameraControls.ActorObserveControlComponent, {
      isLockX: true,
      enableDamping: true,
      dampingFactor: .2,
      zoomMax: 5,
      zoomMin: .5
    });
  }
}
