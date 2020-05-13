/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-debug-tools';
import 'seinjs-dom-hud';

import {createDefaultCamera, createDefaultLights} from '../../utils';

@Sein.SClass({className: 'TestActor'})
class TestActor extends Sein.StaticMeshActor {
  public onInit(initOptions: any) {
    console.log('initOptions from gltf:', initOptions);

    initOptions.m.baseColor.set(1, 0.5, 0.5, 1);
  }

  public onUpdate(delta: number) {
    this.transform.rotationY += 0.01;
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'test.gltf', url: getStaticAssetUrl('/assets/models/script-binding/scene.gltf')});
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, -4), target: new Sein.Vector3(0, 0, 0)});
    createDefaultLights(game);

    game.resource.instantiate<'GlTF'>('test.gltf');
  }
}
