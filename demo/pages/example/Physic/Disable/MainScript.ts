/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-debug-tools';
// import * as CANNON from 'cannon-dtysky';

import {createDefaultLights, createDefaultCamera, config} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private physicDebugger: Sein.DebugTools.CannonDebugRenderer;
  private time: number = 0;
  private box: Sein.BSPBoxActor;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.enablePhysic(
      new Sein.CannonPhysicWorld(
        (window as any).CANNON,
        new Sein.Vector3(0, -9.81, 0)
      ),
      true
    );

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 6)});

    const box = this.box = world.addActor('box', Sein.BSPBoxActor, {
      width: 1, height: 1, depth: 1,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      })
    });
    box.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, physicStatic: true});
    box.addComponent('collider', Sein.BoxColliderComponent, {size: [1, 1, 1]});
    box.rigidBody.event.add('Pick', args => console.log('Pick box', args));

    const picker = new Sein.PhysicPicker(game);
    picker.enablePicking();

    this.physicDebugger = new Sein.DebugTools.CannonDebugRenderer(this.getGame());
  }

  public onUpdate(delta: number) {
    this.physicDebugger.update();

    if (this.time >= 2000) {
      if (this.box.rigidBody.disabled) {
        this.box.rigidBody.enable();
      } else {
        this.box.rigidBody.disable();
      }

      this.time = 0;
    }

    this.time += delta;
  }
}
