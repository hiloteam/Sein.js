/**
 * @File   : MainScript.ts
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 10/14/2019, 2:51:24 PM
 */

import * as Sein from 'seinjs';
import 'seinjs-gpu-particle-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Texture', name: 'smoke', url: getStaticAssetUrl('/assets/sprites/smoke.png')});
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const smoke = world.addActor('smoke', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.RectangleEmitter({
        width: 0.05,
        height: 0.05
      }),
      count: 10,
      maxLifeTime: 1.8,
      minLifeTime: 1.2,
      updateSpeed: 0.2,
      maxVelocity: 0.8,
      minVelocity: 0.1,
      texture: game.resource.get<'Texture'>('smoke'),
      maxSize: 100,
      minSize: 40
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: smoke, position: new Sein.Vector3(0, 0, 1.4)});
  }
}
