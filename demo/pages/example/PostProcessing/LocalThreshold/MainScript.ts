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
      name: 'mean-filter',
      uniforms: {
        u_pixelSize: {value: [1 / game.screenWidth, 1 / game.screenHeight]}
      },
      fs: `
        precision mediump float;
        uniform sampler2D u_origMap;
        uniform vec2 u_pixelSize;
        varying vec2 v_texcoord0;

        void main() {
          vec4 color = vec4(0., 0., 0., 1.);
          for(float h = -1.; h < 2.; h += 1.) {
            for(float w = -1.; w < 2.; w += 1.) {
              color += texture2D(u_origMap, v_texcoord0 + vec2(w * u_pixelSize.x, h * u_pixelSize.y));
            }
          }
          color /= 9.;
          gl_FragColor = color;
        }
      `
    });

    pps.addPass({
      name: 'threshold',
      fs: `
        precision mediump float;
        uniform sampler2D u_origMap;
        uniform sampler2D u_preMap;
        varying vec2 v_texcoord0;

        void main() {
          vec4 origColor = texture2D(u_origMap, v_texcoord0);
          vec4 filterColor = texture2D(u_preMap, v_texcoord0);
          float origGray = origColor.r * 0.299 + origColor.g * 0.587 + origColor.b * 0.114;
          float filterGray = filterColor.r * 0.299 + filterColor.g * 0.587 + filterColor.b * 0.114;
          gl_FragColor = origGray >= filterGray ? vec4(1., 1., 1., 1.) : vec4(0., 0., 0., 1.);
        }
      `
    });
  }
}
