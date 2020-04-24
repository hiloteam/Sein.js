/**
 * @File   : MainScript.ts
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 10/8/2019, 11:37:38 AM
 */

import * as Sein from 'seinjs';
import 'seinjs-gpu-particle-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Atlas', name: 'particles', url: getStaticAssetUrl('/assets/sprites/particles.json')});
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const gate = world.addActor('gate', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.CircleEmitter({
        radius: 0.1,
        arc: 180,
        emitMode: 'Loop',
        arcSpread: 0.0
      }),
      count: 1000,
      maxLifeTime: 3.2,
      minLifeTime: 3.2,
      updateSpeed: 0.01,
      maxVelocity: 0.4,
      minVelocity: 0.4,
      atlas: game.resource.get<'Atlas'>('particles'),
      frames: ['star', 'snow', 'flower', 'flower1'],
      maxSize: 10,
      minSize: 10,
      bornColor1: new Sein.Color(0.996, 0.706, 0.133, 1.0),
      bornColor2: new Sein.Color(0.792, 0.137, 0.831, 1.0),
      dieColor1: new Sein.Color(0.996, 0.706, 0.133, 0),
      dieColor2: new Sein.Color(0.792, 0.137, 0.831, 0)
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: gate, position: new Sein.Vector3(0, 0, 1.5)});
  }
}
