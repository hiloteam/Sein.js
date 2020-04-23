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

    game.hid.add('MouseClick', args => console.log('MouseClick', args));
    game.hid.add('MouseDown', args => console.log('MouseDown', args));
    game.hid.add('MouseUp', args => console.log('MouseUp', args));
    game.hid.add('MouseMove', args => console.log('MouseMove', args));
    game.hid.add('MouseEnter', args => console.log('MouseEnter', args));
    game.hid.add('MouseLeave', args => console.log('MouseLeave', args));
    game.hid.add('MouseOut', args => console.log('MouseOut', args));
    game.hid.add('MouseOver', args => console.log('MouseOver', args));
    game.hid.add('Wheel', args => console.log('Wheel', args));
  }
}
