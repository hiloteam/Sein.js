/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
// import * as CANNON from 'cannon-dtysky';
import 'seinjs-debug-tools';

import {createDefaultLights, createDefaultCamera, config} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private physicDebugger: Sein.DebugTools.CannonDebugRenderer;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.enablePhysic(new Sein.CannonPhysicWorld(
      (window as any).CANNON,
      new Sein.Vector3(0, -9.81, 0)
    ));


    const material = new Sein.BasicMaterial({
      diffuse: config.theme,
      lightType: 'PHONG'
    });
    const box = world.addActor('box', Sein.BSPBoxActor, {
      width: 1, height: 1, depth: 1,
      material
    });
    box.transform.setPosition(-2, 0, 0);
    box.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 0});
    box.addComponent('collider', Sein.BoxColliderComponent, {size: [1, 1, 1]});
    box.rigidBody.event.add('Pick', args => console.log('Pick box', args));

    const parent = world.addActor('parent', Sein.BSPSphereActor, {
      radius: .5, widthSegments: 32, material
    });
    parent.transform.setPosition(2, 0, 0);
    const sphere = world.addActor('sphere', Sein.BSPSphereActor, {
      radius: 1, widthSegments: 32,
      material
    }, parent);
    sphere.transform.setPosition(1, 1, 0);
    sphere.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 0});
    sphere.addComponent('collider', Sein.SphereColliderComponent, {radius: 1});
    sphere.rigidBody.event.add('Pick', args => console.log('Pick sphere', args));
    setTimeout(() => parent.transform.scale.scale(0.5), 100);

    const picker = new Sein.PhysicPicker(game);
    picker.enablePicking();

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 10)});
    this.physicDebugger = new Sein.DebugTools.CannonDebugRenderer(this.getGame());
  }

  public onUpdate(delta: number) {
    this.physicDebugger.update();
  }
}
