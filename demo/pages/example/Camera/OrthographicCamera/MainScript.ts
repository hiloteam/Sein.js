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
  private camera: Sein.OrthographicCameraActor;
  private target: Sein.Vector3;

  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const aspect = game.screenAspect;
    const camera = this.camera = world.addActor('camera', Sein.OrthographicCameraActor, {
      left: -22,
      right: 22,
      top: 22 / aspect,
      bottom: -22 / aspect,
      far: 100,
      near: 0.01
    });
    camera.transform.position.y = 10;
    camera.transform.position.z = -16;

    this.target = new Sein.Vector3(0, 10, 0);
    camera.transform.lookAt(this.target);

    createDefaultLights(game);
    createSein(game);
  }

  public onUpdate() {
    const eye = this.camera.transform.position.clone().subtract(this.target).normalize();
    const deltaQuat = new Sein.Quaternion().setAxisAngle(this.camera.transform.upVector, 0.01);
    eye.transformQuat(deltaQuat);
    eye.scale(16);
    this.camera.transform.position = eye.add(this.target);
    this.camera.lookAt(this.target);
  }
}
