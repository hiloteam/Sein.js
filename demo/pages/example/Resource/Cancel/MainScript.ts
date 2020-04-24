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

    game.resource.load({type: 'Atlas', name: '22.json', url: getStaticAssetUrl('/assets/sprites/22.json')});
    game.resource.load({type: 'Atlas', name: '33.json', url: getStaticAssetUrl('/assets/sprites/33.json')});
    game.resource.cancel('22.json');
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, -2), target: new Sein.Vector3(0, 0, 0)});

    // const two = world.addActor('22', Sein.SpriteActor, {
    //   atlas: game.resource.get<'Atlas'>('22.json'),
    //   frameName: '01',
    //   width: .9,
    //   height: 1,
    //   materialOptions: {
    //     transparent: true
    //   }
    // });
    // two.transform.setPosition(-1, 0, 0);

    const three = world.addActor('33', Sein.SpriteActor, {
      atlas: game.resource.get<'Atlas'>('33.json'),
      frameName: '01',
      width: .66,
      height: .9,
      materialOptions: {
        transparent: true
      }
    });
    three.transform.setPosition(1, 0, 0);
  }
}
