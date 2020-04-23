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

    game.resource.load({type: 'Atlas', name: '22.json', url: '/assets/sprites/22.json'});
    game.resource.load({type: 'Atlas', name: '33.json', url: '/assets/sprites/33.json'});
    game.resource.load({type: 'Texture', name: 'black-hole.png', url: '/assets/sprites/black-hole.png'});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onError  (error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, -2), target: new Sein.Vector3(0, 0, 0)});

    const two = world.addActor('22', Sein.SpriteActor, {
      atlas: game.resource.get<'Atlas'>('22.json'),
      frameName: '01',
      width: .9,
      height: 1,
      materialOptions: {
        transparent: true
      }
    });
    two.transform.setPosition(-1, 0, 0);
    two.addComponent('animator', Sein.AnimatorComponent);
    two.animator.register('hi', new Sein.SpriteAnimation({
      frameNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
      fps: 10
    }));
    two.animator.play('hi', Infinity);

    const three = world.addActor('33', Sein.SpriteActor, {
      atlas: game.resource.get<'Atlas'>('33.json'),
      frameName: '01',
      width: .66,
      height: .9,
      materialOptions: {
        transparent: true
      }
    });
    three.transform.setPosition(1, 0, 0);
    three.addComponent('animator', Sein.AnimatorComponent);
    three.animator.register('hi', new Sein.SpriteAnimation({
      frameNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
      fps: 10
    }));
    three.animator.play('hi', Infinity);

    const atlas = Sein.AtlasManager.CREATE_FROM_TEXTURE(game.resource.get<'Texture'>('black-hole.png'), {
      cellWidth: 128,
      cellHeight: 128,
      framesPerLine: 7,
      frameStart: 0,
      frameCount: 47,
      spacing: 10
    });
    const blackHole = world.addActor('blackHole', Sein.SpriteActor, {
      atlas,
      width: .5,
      height: .5,
      frameName: '0',
      materialOptions: {
        transparent: true
      }
    });
    blackHole.transform.setPosition(0, .5, 0);
    blackHole.addComponent('animator', Sein.AnimatorComponent);
    blackHole.animator.register('hi', new Sein.SpriteAnimation({fps: 30}));
    blackHole.animator.play('hi', Infinity);
  }
}
