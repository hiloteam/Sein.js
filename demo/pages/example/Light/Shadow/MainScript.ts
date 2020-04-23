/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {loadSein, createSein, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game);
    createSein(game);

    world.addActor('amLight', Sein.AmbientLightActor, {
      color: new Sein.Color(1, 1, 1),
      amount: .5
    });
    const light = world.addActor('light', Sein.DirectionalLightActor, {
      direction: new Sein.Vector3(0, -1, 1),
      color: new Sein.Color(1, 1, 1),
      amount: 2
    });

    light.root.shadow = {
      width: 3840,
      height: 2160
    };
    Sein.findActorByName<Sein.StaticMeshActor>(world, 'ground').root.material.receiveShadows = true;
  }
}
