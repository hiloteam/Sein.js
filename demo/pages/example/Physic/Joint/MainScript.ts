/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

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

    this.createPointToPoint();
    this.createHinge();
    this.createDistance();
    this.createLock();
    this.createSpring();

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 10, 0), position: new Sein.Vector3(0, 20, 30)});
  }

  private createPointToPoint() {
    const {box, sphere} = this.createSphereAndBox(0);

    box.addComponent('joint', Sein.PointToPointJointComponent, {
      actor: sphere,
      pivotA: new Sein.Vector3(-2, 0, 0), pivotB: new Sein.Vector3(2, 0, 0),
      maxForce: 40
    });
  }

  private createHinge() {
    const {box, sphere} = this.createSphereAndBox(1);

    box.addComponent('joint', Sein.HingeJointComponent, {
      actor: sphere,
      pivotA: new Sein.Vector3(-2, 0, 0), pivotB: new Sein.Vector3(2, 0, 0)
    });
  }

  private createDistance() {
    const {box, sphere} = this.createSphereAndBox(2);

    box.addComponent('joint', Sein.DistanceJointComponent, {actor: sphere, distance: 5});
  }

  private createLock() {
    const {box, sphere} = this.createSphereAndBox(3);

    box.addComponent('joint', Sein.LockJointComponent, {actor: sphere});
  }

  private createSpring() {
    const {box, sphere} = this.createSphereAndBox(4);

    box.addComponent('joint', Sein.SpringJointComponent, {
      actor: sphere,
      restLength: 1, stiffness: 0, damping: .8,
      localAnchorA: new Sein.Vector3(-1, 0 ,0), localAnchorB: new Sein.Vector3(1, 0 ,0),
    });
  }

  private createSphereAndBox(index: number) {
    const world = this.getWorld();

    const box = world.addActor('box', Sein.BSPBoxActor, {
      width: 1, height: 1, depth: 1,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      })
    });
    box.transform.setPosition((index - 2) * 5 - 1.5, 15, (index - 2) * 5);
    box.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, restitution: 1, unControl: true});
    box.addComponent('collider', Sein.BoxColliderComponent, {size: [1, 1, 1]});

    const sphere = world.addActor('box', Sein.BSPSphereActor, {
      radius: .5, widthSegments: 32,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      })
    });
    sphere.transform.setPosition((index - 2) * 5 + 1.5, 10, (index - 2) * 5);
    sphere.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, restitution: 1, unControl: true});
    sphere.addComponent('collider', Sein.SphereColliderComponent, {radius: .5});

    return {box, sphere};
  }
}
