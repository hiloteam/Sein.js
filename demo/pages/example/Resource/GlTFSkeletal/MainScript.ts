/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private pig: Sein.SkeletalMeshActor;
  private animations: string[] = [];

  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'pig.gltf', url: getStaticAssetUrl('/assets/models/pig/fairy_pig.gltf')});
    game.resource.load({type: 'GlTF', name: 'animation.gltf', url: getStaticAssetUrl('/assets/models/animation/animation.gltf')});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 1, -6), target: new Sein.Vector3(0, 1, 0)});
    createDefaultLights(game);

    game.resource.instantiate<'GlTF'>('animation.gltf').forEach(actor => {
      if (actor.animator) {
        actor.animator.play(null, Infinity);
      }
    });

    this.pig = game.resource.instantiate<'GlTF'>('pig.gltf').get(0);
    this.pig.transform.x += 3;
    this.animations = this.pig.animator.animationNames;

    this.pig.animator.event.add('End', this.playNext);
    this.playNext();
  }

  private playNext = () => {
    const {animator} = this.pig;

    let index = this.animations.indexOf(animator.current) + 1;

    if (index >= this.animations.length) {
      index = 0;
    }

    animator.play(this.animations[index]);
  }
}
