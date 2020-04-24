/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-debug-tools';
import 'seinjs-dom-hud';

import {createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'Image', name: 'yoku.jpg', url: getStaticAssetUrl('/assets/yoku.jpg')});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 2), target: new Sein.Vector3(0, 0, 0)});

    world.addActor('plane', Sein.BSPPlaneActor, {
      width: 2.56,
      height: 1.92,
      material: new Sein.BasicMaterial({
        diffuse: new Sein.Texture({image: game.resource.get<'Image'>('yoku.jpg'), flipY: true}),
        lightType: 'NONE'
      })
    });
  }
}
