/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/19/2019, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';
import 'seinjs-inspector';

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

    game.addActor('inspector', Sein.Inspector.Actor, {
      dom: document.querySelector<HTMLDivElement>('.example-game-content'),
      updateRate: 10
    });
  }
}
