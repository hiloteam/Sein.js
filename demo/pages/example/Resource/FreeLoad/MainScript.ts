/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {target: new Sein.Vector3(.2, 0, 0), position: new Sein.Vector3(.2, 0, 1)});
    createDefaultLights(game);
    game.resource.load({name: 'bird.gltf', url: getStaticAssetUrl('/assets/models/mul-bird/scene.gltf')})
      .then(result => {
        console.log(result);
        game.resource.instantiate<'GlTF'>('bird.gltf').forEach(actor => {actor.animator.play(null, Infinity);});
      });
  }
}
