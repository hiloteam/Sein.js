/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
// import * as CANNON from 'cannon-dtysky';

import {createDefaultLights, createDefaultCamera, config} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.enablePhysic(new Sein.CannonPhysicWorld(
      (window as any).CANNON,
      new Sein.Vector3(0, -9.81, 0)
    ));

    const ground = world.addActor('ground', Sein.BSPBoxActor, {
      width: 100, height: 1, depth: 100,
      material: new Sein.BasicMaterial({
        diffuse: new Sein.Color(1, 1, 1),
        lightType: 'PHONG'
      })
    });
    ground.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 0, physicStatic: true, restitution: 1});
    ground.addComponent('collider', Sein.BoxColliderComponent, {size: [100, 1, 100]});

    for (let index = 0; index < 10; index += 1) {
      const box = world.addActor('box', Sein.BSPBoxActor, {
        width: 1, height: 1, depth: 1,
        material: new Sein.BasicMaterial({
          diffuse: config.theme,
          lightType: 'PHONG'
        })
      });
      box.transform.setPosition(index * 1.5, 10, index * 1.5);
      box.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, restitution: 1, unControl: true});
      box.addComponent('collider', Sein.BoxColliderComponent, {size: [1, 1, 1]});

      const sphere = world.addActor('box', Sein.BSPSphereActor, {
        radius: .5, widthSegments: 32,
        material: new Sein.BasicMaterial({
          diffuse: config.theme,
          lightType: 'PHONG'
        })
      });
      sphere.transform.setPosition(-index * 1.5, 10, -index * 1.5);
      sphere.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, restitution: 1, unControl: true});
      sphere.addComponent('collider', Sein.SphereColliderComponent, {radius: .5});
    }

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 10, 0), position: new Sein.Vector3(0, 20, 30)});
  }
}
