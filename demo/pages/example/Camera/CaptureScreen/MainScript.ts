/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

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

    const sein = Sein.findActorByName(world, 'Sein');

    game.event.add('Capture', this.save);
  }

  private save = async () => {
    // 随机使用blob或base64模式
    const mode = Math.random() > 0.5 ? 'base64' : 'blob';

    const camera = this.getWorld().mainCamera;
    const link = document.querySelector<HTMLAnchorElement>('#link-for-download');

    if (mode === 'blob') {
      const blob = await camera.captureScreen('blob', 'image/png');
      console.log(blob);
      link.href = URL.createObjectURL(blob);
    } else {
      const base64 = await camera.captureScreen('base64', 'image/png');
      console.log(base64);
      link.href = base64;
    }
  }
}
