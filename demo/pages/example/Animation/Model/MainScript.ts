/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultLights, createDefaultCamera, createSein, loadSein} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createSein(game);
    createDefaultLights(game);
    createDefaultCamera(game);

    const sphere1 = Sein.findActorByName(world, 'Sphere1');
    sphere1.animator.play('Animation1', 10);
    const sphere2 = Sein.findActorByName(world, 'Sphere2');
    setTimeout(
      () => sphere2.animator.play('Animation2', 10),
      300
    );
  }
}
