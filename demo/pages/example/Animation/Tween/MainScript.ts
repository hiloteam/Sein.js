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
    sein.addComponent('animator', Sein.AnimatorComponent);
    sein.animator.register('tween', new Sein.TweenAnimation({create: onComplete => Sein.Tween.to(
      {step: 0},
      {step: 6.28},
      {
        onUpdate: (_, {target}) => {
          console.log(target.step);
          sein.transform.rotationY = target.step;
        },
        onComplete,
        duration: 2000
      }
    ) as Sein.Tween}));
    sein.animator.play('tween');
  }
}
