/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-gpu-particle-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    this.getGame().resource.load({type: 'Texture', name: 'point', url: getStaticAssetUrl('/assets/point.png')});
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const particleSystem = world.addActor('particleSystem', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.EdgeEmitter({
        point1: new Sein.Vector3(0, 0, 0),
        point2: new Sein.Vector3(4, 4, 4)
      }),
      count: 1000,
      maxLifeTime: 4,
      minLifeTime: 2,
      updateSpeed: .01,
      maxVelocity: 1,
      minVelocity: .5,
      texture: game.resource.get<'Texture'>('point'),
      maxSize: 20,
      minSize: 10,
      maxAcceleration: 0
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: particleSystem, position: new Sein.Vector3(0, 0, 6)});
  }
}
