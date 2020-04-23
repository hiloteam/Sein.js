/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

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
    const animator = sein.addComponent<Sein.AnimatorComponent<{to: number}>>('animator', Sein.AnimatorComponent);
    animator.register('anim0', new Sein.TweenAnimation({create: onComplete => Sein.Tween.to(
      sein.transform.rotation,
      {y: Math.PI},
      {onComplete, duration: 1000}
    ) as Sein.Tween}));
    animator.register('anim1', new Sein.TweenAnimation({create: onComplete => Sein.Tween.to(
      sein.transform.position,
      {y: 3},
      {onComplete, duration: 1000}
    ) as Sein.Tween}));
    animator.register('anim2', new Sein.TweenAnimation({create: onComplete => Sein.Tween.to(
      sein.transform.rotation,
      {y: Math.PI * 2},
      {onComplete, duration: 1000}
    ) as Sein.Tween}));
    animator.register('anim3', new Sein.TweenAnimation({create: onComplete => Sein.Tween.to(
      sein.transform.position,
      {y: 0},
      {onComplete, duration: 1000}
    ) as Sein.Tween}));

    animator.addTransition('anim0', 'anim1', params => params.to === 1);
    animator.addTransition('anim0', 'anim2', params => params.to === 2);
    animator.addTransition('anim0', 'anim3', params => params.to === 3);
    animator.setParameter('to', 2);

    sein.animator.play('anim0');
  }
}
