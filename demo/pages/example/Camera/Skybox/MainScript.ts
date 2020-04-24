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
  private camera: Sein.PerspectiveCameraActor;
  private target: Sein.Vector3;

  public onPreload() {
    loadSein(this.getGame());

    this.getGame().resource.load({type: 'CubeTexture', name: 'skybox.tex', url: getStaticAssetUrl('/assets/skybox/snow'), images: {
      left: 'left.jpg',
      right: 'right.jpg',
      top: 'top.jpg',
      bottom: 'bottom.jpg',
      front: 'front.jpg',
      back: 'back.jpg'
    }});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const camera = this.camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
      aspect: game.screenAspect,
      fov: 60,
      near: 0.01,
      far: 100,
      position: new Sein.Vector3(0, 10, -20),
      backgroundMat: new Sein.SkyboxMaterial({
        type: 'Cube',
        uniforms: {
          u_color: {value: new Sein.Color(1, 1, 1)},
          u_texture: {value: game.resource.get<'CubeTexture'>('skybox.tex')}
        }
      })
    });

    this.target = new Sein.Vector3(0, 10, 0);
    camera.transform.lookAt(this.target);

    createDefaultLights(game);
    createSein(game);
  }

  public onUpdate() {
    const eye = this.camera.transform.position.clone().subtract(this.target).normalize();
    const deltaQuat = new Sein.Quaternion().setAxisAngle(this.camera.transform.upVector, 0.01);
    eye.transformQuat(deltaQuat);
    eye.scale(20);
    this.camera.transform.position = eye.add(this.target);
    this.camera.lookAt(this.target);
  }
}
