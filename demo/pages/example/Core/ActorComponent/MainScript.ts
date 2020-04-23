/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {createDefaultLights, createDefaultCamera, createSein, loadSein} from '../../utils';

interface IRotateActorComponentState {
  speed: number;
}

@Sein.SClass({className: 'RotateActorComponent'})
class RotateActorComponent extends Sein.Component<IRotateActorComponentState> {
  private speed: number;

  public onInit(initState: IRotateActorComponentState) {
    this.speed = initState.speed;
  }

  public onUpdate(delta: number) {
    // Get root component
    const root = this.getRoot<Sein.SceneComponent>();
    root.rotate(root.upVector, delta * this.speed / 500);
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
    console.log(sein);
    sein.addComponent('rotate', RotateActorComponent, {speed: 2});

    console.log(sein.findComponentByName('rotate'));
  }
}
