/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-dom-hud';

import {createDefaultLights, createDefaultCamera, createSein, loadSein} from '../../utils';

function createDom(text: string, bg: string) {
  const dom = document.createElement('div');
  dom.innerText = text;
  // 让元素可触发事件
  dom.style.pointerEvents = 'all';
  dom.style.width = '70px';
  dom.style.height = '35px';
  dom.style.backgroundColor = bg;
  dom.style.color = '#fff';
  dom.style.textAlign = 'center';
  dom.style.lineHeight = '35px';

  return dom;
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

    const hud1 = world.addActor('Sphere0', Sein.DomHUD.Actor, {
      dom: createDom('sphere0', '#f00')
    });
    hud1.linkToActor(Sein.findActorByName(world, 'Sphere'), 0, -20);
    hud1.event.add('PickStart', args => console.log('sphere0', args));

    const hud2 = Sein.findActorByName(world, 'Sphere2').addComponent('hud', Sein.DomHUD.Component, {
      dom: createDom('sphere2', '#00f'),
      autoLink: true,
      autoLinkY: -40
    });
    hud2.event.add('PickStart', args => console.log('sphere2', args));
  }
}
