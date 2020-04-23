/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultLights, createDefaultCamera} from '../../utils';

class CustomShaderMaterial extends Sein.RawShaderMaterial {
  constructor(options: {
    color?: Sein.Color,
    map?: Sein.Texture
  }) {
    super({
      defines: `
    precision mediump float;
    `,
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
        u_color: {value: options.color},
        u_map: {value: options.map}
      },
      vs: {
        header: `
    attribute vec3 a_position;
    attribute vec2 a_uv;
    uniform mat4 u_modelViewProjectionMatrix;

    #ifdef HAS_MAP
      varying vec2 v_uv;
    #endif
        `,
        main: `
    void main() {
      #ifdef HAS_MAP
        v_uv = a_uv;
      #endif
      gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);
    }
        `
      },
      fs: `
    #ifdef HAS_MAP
      varying vec2 v_uv;
      uniform sampler2D u_map;
    #else
      uniform vec4 u_color;
    #endif

    void main() {
      #ifdef HAS_MAP
        gl_FragColor = texture2D(u_map, v_uv);
      #else
        gl_FragColor = u_color;
      #endif
    }
      `
    });
  }

  public getCustomRenderOption(options: any) {
    // debugger;
    if (this.getUniform('u_map').value) {
      options.HAS_MAP = 1;
    }

    return options;
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    this.getGame().resource.load({type: 'Texture', name: 'sprite.jpg', url: '/assets/paradise.jpg', flipY: true});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.addActor('box', Sein.BSPPlaneActor, {
      width: 1, height: 1, material: new CustomShaderMaterial({color: new Sein.Color(0, 1, 1, 1)})
    }).transform.setPosition(1, 0, 0);
    world.addActor('box', Sein.BSPPlaneActor, {
      width: 1, height: 1, material: new CustomShaderMaterial({map: game.resource.get<'Texture'>('sprite.jpg')})
    }).transform.setPosition(-1, 0, 0);

    createDefaultLights(game);
    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 4), target: new Sein.Vector3(0, 0, 0)});
  }
}
