/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/19/2019, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';
import 'seinjs-post-processing-system';

import {createDefaultLights, createDefaultCamera, createSein, loadSein} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();

    createSein(game);
    createDefaultLights(game);
    createDefaultCamera(game);

    const pps = game.addActor('threshold-system', Sein.PostProcessingSystem.Actor);
    pps.addPass({
      name: 'pass1',
      fs: `
        precision mediump float;
        uniform sampler2D u_preMap;
        varying vec2 v_texcoord0;

        void main() {
          vec4 color = texture2D(u_preMap, v_texcoord0);
          float gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
          gl_FragColor = gray > 0.7 ? vec4(1., 1., 1., 1.) : vec4(0., 0., 0., 1.);
        }
      `
    });
  }
}
