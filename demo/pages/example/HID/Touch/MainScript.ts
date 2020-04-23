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

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createSein(game);
    createDefaultLights(game);
    createDefaultCamera(game);

    game.hid.add('TouchStart', args => console.log('TouchStart', args));
    game.hid.add('TouchEnd', args => console.log('TouchEnd', args));
    game.hid.add('TouchCancel', args => console.log('TouchCancel', args));
    game.hid.add('TouchMove', args => console.log('TouchMove', args));
  }
}
