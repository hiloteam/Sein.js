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

    world.addActor('light', Sein.SpotLightActor, {
      color: new Sein.Color(1, 1, 1),
      direction: new Sein.Vector3(0, -1, .5),
      amount: 200,
      range: 100,
      position: new Sein.Vector3(0, 30, -8)
    });
  }
}
