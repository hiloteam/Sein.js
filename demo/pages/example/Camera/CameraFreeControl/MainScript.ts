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
  private target: Sein.Vector3;

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
      far: 100,
      position: new Sein.Vector3(0, 10, -20)
    });

    this.target = new Sein.Vector3(0, 10, 0);
    camera.transform.lookAt(this.target);

    createDefaultLights(game);
    createSein(game);

    camera.addComponent('control', Sein.CameraControls.CameraFreeControlComponent, {
      enableDamping: true,
      dampingFactor: .2,
      zoomMax: 100,
      zoomMin: .1,
      rotateXSpeed: .5,
      rotateYSpeed: .5
    });
  }
}
