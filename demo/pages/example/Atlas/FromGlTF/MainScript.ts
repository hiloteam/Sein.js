/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private atlas: Sein.AtlasManager;

  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'sprite-atlas.gltf', url: '/assets/models/sprite-atlas/scene.gltf'});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    game.resource.instantiate('sprite-atlas.gltf');
    console.log(game.resource.get('sprite-atlas.gltf'));

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 3)});
  }
}
