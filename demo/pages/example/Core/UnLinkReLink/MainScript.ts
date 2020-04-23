/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {createDefaultLights, createDefaultCamera, loadSein} from '../../utils';

@Sein.SClass({className: 'ShinningComponent'})
class ShinningComponent extends Sein.Component {
  private channel: 'r' | 'g' | 'b' = 'b';
  private time = 2000;

  public onUnLink() {
    switch (this.channel) {
      case 'r':
        this.channel = 'g';
        break;
      case 'g':
        this.channel = 'b';
        break;
      case 'b':
        this.channel = 'r';
        break;
      default:
        break;
    }
  }

  public onReLink() {
    this.getRoot<Sein.StaticMeshComponent>().getMaterial().getUniform<Sein.Color>('diffuse').value.set(0, 0, 0, 1);
    this.time = 0;
  }

  public onUpdate(delta: number) {
    this.time += 0;

    if (this.time < 2000) {
      const color = this.getRoot<Sein.StaticMeshComponent>().getMaterial().getUniform<Sein.Color>('diffuse');
      color.value[this.channel] = this.time * 0.0005;
      this.time += delta;
    }
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  private time = 0;
  private box: Sein.BSPBoxActor;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultLights(game);
    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 10), target: new Sein.Vector3(0, 0, 0)});

    this.box = world.addActor('box', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0, 1)})
    });
    this.box.addComponent('shining', ShinningComponent);
  }

  public onUpdate(delta: number) {
    this.time += delta;

    if (this.time >= 2000) {
      if (this.box.linked) {
        this.box.unLink();
      } else {
        this.box.reLink();
      }

      this.time = 0;
    }
  }
}
