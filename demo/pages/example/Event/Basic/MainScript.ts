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

    // proxy to root component
    sein.event.add('test', args => console.log(args));
    sein.event.trigger('test', {info: 'Actor'});

    const component = sein.addComponent('custom', CustomComponent);
    component.event.add('test', args => console.log(args));
    component.event.trigger('test', {info: 'Component'});

    // throw error
    sein.event.unregister('test');
    sein.event.trigger('test', {info: 'haha'});
  }
}
