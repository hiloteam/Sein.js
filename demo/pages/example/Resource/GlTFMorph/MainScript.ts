/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private morph: Sein.BSPMorphActor;
  private count: number = 0;
  private current: number[] = [0];

  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'morph.gltf', url: getStaticAssetUrl('/assets/models/morph/morph.gltf')});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 2), target: new Sein.Vector3(0, 0, 0)});
    createDefaultLights(game);

    this.morph = game.resource.instantiate<'GlTF'>('morph.gltf').get(0);
  }

  public onUpdate() {
    this.count += .02;

    if (Math.abs(this.count - Math.PI) <= 0.01) {
      this.generateCurrent();

      this.count = 0;
    }

    this.current.forEach(index => {
      this.morph.root.weights[index] = Math.sin(this.count);
    });
  }

  private generateCurrent() {
    const r = crypto.getRandomValues(new Uint8Array([0, 0]));
    const num = ~~(r[0] / 256 * 3);
    const start = ~~(r[1] / 256 * 3);
    const pre = this.current.slice();

    this.current = [];
    for (let i = 0; i <= num; i += 1) {
      let j = start + i;

      if (j > 2) {
        j -= 3;
      }

      this.current.push(j);
    }

    this.current.sort();

    if (this.current.toString() === pre.toString()) {
      this.generateCurrent();
    }
  }
}
