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

    game.resource.load({type: 'CubeTexture', name: 'snow.jpg', url: getStaticAssetUrl('/assets/skybox/snow'), images: {
      left: 'left.jpg',
      right: 'right.jpg',
      top: 'top.jpg',
      bottom: 'bottom.jpg',
      front: 'front.jpg',
      back: 'back.jpg'
    }});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, .1), target: new Sein.Vector3(0, 0, 0)});

    world.addActor('plane', Sein.BSPBoxActor, {width: 2, height: 2, depth: 2, material: new Sein.BasicMaterial({
      diffuse: game.resource.get<'CubeTexture'>('snow.jpg'),
      lightType: 'NONE',
      side: Sein.Constants.FRONT_AND_BACK
    })});
  }
}
