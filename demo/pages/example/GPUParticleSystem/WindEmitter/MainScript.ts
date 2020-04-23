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
    this.getGame().resource.load({type: 'Atlas', name: 'particles', url: '/assets/sprites/particles.json'});
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const particleSystem = world.addActor('particleSystem', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.WindEmitter({
        planeLeftTop: new Sein.Vector3(-10, 4, -10),
        planeRightBottom: new Sein.Vector3(10, 3, 10),
        direction: new Sein.Vector3(-1, -4, 1)
      }),
      count: 200,
      maxLifeTime: 5,
      minLifeTime: 3,
      updateSpeed: .05,
      maxVelocity: 1,
      minVelocity: .5,
      atlas: game.resource.get<'Atlas'>('particles'),
      frames: ['star', 'snow', 'flower', 'flower1'],
      maxSize: 20,
      minSize: 10,
      minAcceleration: .1,
      maxAcceleration: .4,
      bornColor1: new Sein.Color(.2, .2, .2, 1),
      bornColor2: new Sein.Color(1, 1, 1, 1),
      dieColor1: new Sein.Color(.2, .2, .2, 0),
      dieColor2: new Sein.Color(1, 1, 1, 0)
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: particleSystem, position: new Sein.Vector3(0, 0, 6)});
  }
}
