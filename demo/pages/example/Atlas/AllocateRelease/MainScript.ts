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

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.atlas = Sein.AtlasManager.CREATE_EMPTY({width: 512, height: 512});
    world.addActor('sprite', Sein.SpriteActor, {
      width: 2, height: 2,
      texture: this.atlas.getWholeTexture({flipY: true}),
      materialOptions: {transparent: true}
    });

    const space = 10;
    const timer = game.addActor('timer', Sein.TimerActor);
    timer.event.add('Step', () => {
      const w = ~~(Math.random() * 96 + 96);
      const h = ~~(Math.random() * 96 + 96);
      if (!this.allocateFrame({w, h, space})) {
        // 没有分配成功，去释放
        const frames = Object.keys(this.atlas.frames);
        this.atlas.releaseFrame(frames[0]);
        if (frames.length >= 2) {
          this.atlas.releaseFrame(frames[1]);
        }

        this.allocateFrame({w, h, space});
      }

      // 使用率
      console.log(this.atlas.usage);
    });
    timer.start(Infinity, 200);

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 3)});
  }

  private allocateFrame(region: {w: number, h: number, space: number}) {
    return this.atlas.allocateFrame(region, (context, region, frameName) => {
      context.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
      context.fillRect(region.x, region.y, region.w, region.h);
      context.font = `${region.w / 4}px monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = 'white';

      context.fillText(frameName, region.x + region.w / 2, region.y + region.h / 2);
    });
  }
}
