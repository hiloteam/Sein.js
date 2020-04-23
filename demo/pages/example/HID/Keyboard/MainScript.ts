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

    createSein(game);
    createDefaultLights(game);
    createDefaultCamera(game);

    game.hid.add('KeyDown', args => console.log('KeyDown', args));
    game.hid.add('KeyUp', args => console.log('KeyUp', args));
    game.hid.add('KeyPress', args => console.log('KeyPress', args));
  }
}
