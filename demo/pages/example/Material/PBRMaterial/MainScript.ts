/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    this.getGame().resource.load({type: 'GlTF', name: 'soda.gltf', url: getStaticAssetUrl('/assets/models/soda/scene.gltf')});
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 3, 3)});
    const actor = game.resource.instantiate<'GlTF'>('soda.gltf').get<Sein.StaticMeshActor>(0);
    console.log(actor);
  }
}
