/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/19/2019, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';
import 'seinjs-post-processing-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';

function generateRandomVec3(z: number) {
  return new Sein.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, z);
}

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    game.renderer.clearColor = new Sein.Color(0, 0, 0, 1);

    createDefaultLights(game);
    createDefaultCamera(game, {
      target: new Sein.Vector3(0, 0, 30), position: new Sein.Vector3(0, 0, -5)
    });

    for (let index = 0; index < 30; index += 1) {
      world.addActor('red', Sein.BSPBoxActor, {
        width: 1, height: 1, depth: 1,
        position: generateRandomVec3(index * 2), rotation: new Sein.Euler(Math.random(), Math.random(), Math.random()),
        material: new Sein.PBRMaterial({baseColor: new Sein.Color(Math.random(), Math.random(), Math.random())})
      });
    }

    const pps = game.addActor('bloom', Sein.PostProcessingSystem.Actor);

    pps.addPass({
      name: 'step1',
      frameOptions: {
        scaleH: .5, scaleW: .5
      },
      uniforms: {
        u_pixelSize: {value: [4 / game.screenWidth, 2 / game.screenHeight]}
      },
      fs: `
        precision mediump float;
        uniform sampler2D u_preMap;
        uniform vec2 u_pixelSize;
        varying vec2 v_texcoord0;

        void main() {
          vec4 color = vec4(0., 0., 0., 1.);
          for(float i = -4.; i < 5.; i += 1.) {
            color += texture2D(u_preMap, v_texcoord0 + vec2(i * u_pixelSize.x, 0.));
          }
          color /= 9.;
          gl_FragColor = color;
        }
      `
    });

    pps.addPass({
      name: 'step2',
      frameOptions: {
        scaleH: .5, scaleW: .5
      },
      uniforms: {
        u_pixelSize: {value: [4 / game.screenWidth, 2 / game.screenHeight]}
      },
      fs: `
        precision mediump float;
        uniform sampler2D u_preMap;
        uniform vec2 u_pixelSize;
        varying vec2 v_texcoord0;

        void main() {
          vec4 color = vec4(0., 0., 0., 1.);
          for(float i = -4.; i < 4.; i += 1.) {
            color += texture2D(u_preMap, v_texcoord0 + vec2(0., i * u_pixelSize.y));
          }
          color /= 9.;
          gl_FragColor = color;
        }
      `
    });

    pps.addPass({
      name: 'step3',
      fs: `
        precision mediump float;
        uniform sampler2D u_origMap;
        uniform sampler2D u_preMap;
        varying vec2 v_texcoord0;

        void main() {
          vec4 hdrColor = texture2D(u_origMap, v_texcoord0);
          vec4 bloomColor = texture2D(u_preMap, v_texcoord0);
          float gray = bloomColor.r * 0.299 + bloomColor.g * 0.587 + bloomColor.b * 0.114;
          hdrColor += bloomColor;
          gl_FragColor = hdrColor;
        }
      `
    });
  }
}
