/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'Texture', name: 'sprite.jpg', url: getStaticAssetUrl('/assets/paradise.jpg'), flipY: true});
    game.resource.load({type: 'Atlas', name: '22.json', url: getStaticAssetUrl('/assets/sprites/22.json')});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.addActor('sprite', Sein.SpriteActor, {
      width: 1, height: 1,
      texture: game.resource.get<'Texture'>('sprite.jpg'),
      position: new Sein.Vector3(-2, 0, 0),
      opacity: 0.4,
      materialOptions: {blendSrc: Sein.Constants.SRC_ALPHA}
    });

    const atlas = Sein.AtlasManager.CREATE_FROM_TEXTURE(game.resource.get<'Texture'>('sprite.jpg'), {
      cellWidth: 500,
      cellHeight: 500,
      framesPerLine: 1
    });
    world.addActor('sprite2', Sein.SpriteActor, {
      width: 1, height: 1,
      atlas,
      frameName: '0',
      position: new Sein.Vector3(2, 0, 0)
    });

    const empty = world.addActor('empty', Sein.SceneActor, {rotation: new Sein.Vector3(1, 0, 0)});
    empty.addComponent('22', Sein.SpriteComponent, {
      width: 1.8, height: 2,
      atlas: game.resource.get<'Atlas'>('22.json'),
      frameName: '01',
      position: new Sein.Vector3(0, 0, 0),
      isBillboard: true
    });

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, -6)});
  }
}
