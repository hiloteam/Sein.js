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

    game.resource.load({type: 'Image', name: 'bubble.png', url: getStaticAssetUrl('/assets/sprites/bubble.png')});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.atlas = Sein.AtlasManager.CREATE_FROM_GRIDS(
      {width: 512, height: 512, rows: 4, cols: 4, space: 10},
      (atlas, context, region, frameName) => {
        context.drawImage(game.resource.get<'Image'>('bubble.png'), region.x, region.y, region.w, region.h);
        context.font = '48px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';

        context.fillText(frameName, region.x + 56, region.y + 72, 56);

        world.addActor('sprite', Sein.SpriteActor, {
          width: 1, height: 1,
          atlas,
          frameName,
          position: new Sein.Vector3((region.col - 1.5) * 1.3, (1.5 - region.row) * 1.3, 0),
          materialOptions: {transparent: true},
          isBillboard: true
        });
      }
    );

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 8)});
  }
}
