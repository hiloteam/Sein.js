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
    this.getGame().resource.load({type: 'GlTF', name: 'scene.gltf', url: '/assets/models/khr-webgl/scene.gltf'});
  }

  public onCreate() {
    const game = this.getGame();

    game.resource.instantiate<'GlTF'>(`scene.gltf`);

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 4), target: new Sein.Vector3(0, 0, 0)});
  }
}
