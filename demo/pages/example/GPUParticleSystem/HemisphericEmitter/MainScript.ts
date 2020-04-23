/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-gpu-particle-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';
import { isNewExpression } from '_typescript@3.2.2@typescript';

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
      emitter: new Sein.GPUParticleSystem.HemisphericEmitter({
        radius: 2
      }),
      count: 1000,
      maxLifeTime: 3,
      minLifeTime: 1,
      updateSpeed: 0.01,
      maxVelocity: 2.4,
      minVelocity: 1.2,
      atlas: game.resource.get<'Atlas'>('particles'),
      frames: ['star', 'snow', 'flower', 'flower1'],
      maxSize: 20,
      minSize: 10,
      bornColor1: new Sein.Color(0.996, 0.706, 0.133, 1.0),
      bornColor2: new Sein.Color(0.792, 0.137, 0.831, 1.0),
      dieColor1: new Sein.Color(0.996, 0.706, 0.133, 0),
      dieColor2: new Sein.Color(0.792, 0.137, 0.831, 0),
    });
    particleSystem.addComponent('helper', Sein.BSPSphereComponent, {
      radius: 2,
      material: new Sein.BasicMaterial({wireframe: true})
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: particleSystem, position: new Sein.Vector3(0, 0, 6)});
  }
}
