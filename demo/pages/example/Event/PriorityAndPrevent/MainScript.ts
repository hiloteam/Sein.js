/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {createDefaultLights, createDefaultCamera, createSein, loadSein} from '../../utils';

class CustomComponent extends Sein.Component {
  get event(): Sein.EventManager<{test: {info: string}}> {
    return this._event;
  };

  public onInit() {
    this._event.register('test');
  }
}

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

    // priority
    sein.event.add('test', () => console.log(1));
    sein.event.add('test', () => console.log(3));
    sein.event.add('test', () => console.log(0), 0);
    sein.event.add('test', () => console.log(2), 2);

    sein.event.trigger('test');

    // prevent
    sein.event.add('test1', () => console.log(1));
    sein.event.add('test1', () => {
      console.log(0);
      // prevent
      return true;
    }, 0);

    sein.event.trigger('test1');
  }
}
