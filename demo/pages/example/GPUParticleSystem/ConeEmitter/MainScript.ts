/**
 * @File   : MainScript.ts
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 10/14/2019, 3:02:12 PM
 */

import * as Sein from 'seinjs';
import 'seinjs-gpu-particle-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Texture', name: 'zhuye', url: '/assets/sprites/zhuye.png'});
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const texture = game.resource.get<'Texture'>('zhuye');
    texture.wrapS = Sein.Constants.CLAMP_TO_EDGE;
    texture.wrapT = Sein.Constants.CLAMP_TO_EDGE;
    
    const zhulin = world.addActor('zhulin', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.ConeEmitter({
        radius: 0.5,
        angle: Math.PI / 6
      }),
      count: 100,
      maxLifeTime: 2.4,
      minLifeTime: 1.2,
      updateSpeed: 0.56,
      maxVelocity: 0.4,
      minVelocity: 0.2,
      texture: game.resource.get<'Texture'>('zhuye'),
      maxSize: 54,
      minSize: 28,
      maxRotation: Math.PI / 3,
      minRotation: -Math.PI / 3
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: zhulin, position: new Sein.Vector3(0, 0, 2.0)});
  }
}
