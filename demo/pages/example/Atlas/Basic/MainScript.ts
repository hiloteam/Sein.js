/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private atlas: Sein.AtlasManager;

  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'Image', name: 'bubble.png', url: '/assets/sprites/bubble.png'});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.atlas = Sein.AtlasManager.CREATE_EMPTY({width: 512, height: 512});
    const frameName = this.atlas.allocateFrame({w: 128, h: 128});

    world.addActor('sprite', Sein.SpriteActor, {
      width: 1, height: 1,
      atlas: this.atlas,
      frameName,
      materialOptions: {transparent: true},
      isBillboard: true
    });

    const timer = game.addActor('timer', Sein.TimerActor);
    timer.event.add('Step', () => {
      this.atlas.updateFrame(frameName, (context, region) => {
        context.drawImage(game.resource.get<'Image'>('bubble.png'), region.x, region.y, region.w, region.h);
        context.font = '48px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';

        context.fillText((Math.random() * 100).toFixed(0), region.x + 56, region.y + 72, 56);
      });
    });
    timer.start(Infinity, 1000);

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 2)});
  }
}
