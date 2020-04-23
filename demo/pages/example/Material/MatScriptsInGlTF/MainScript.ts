/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    this.getGame().resource.load({type: 'GlTF', name: 'material-script.gltf', url: '/assets/models/material-script/scene.gltf'});
  }

  public onCreate() {
    const game = this.getGame();

    game.resource.instantiate<'GlTF'>(`material-script.gltf`);

    createDefaultLights(game);
    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 4), target: new Sein.Vector3(0, 0, 0)});
  }
}
