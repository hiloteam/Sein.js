/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera} from '../../utils';

@Sein.SMaterial({className: 'ColoredSpriteMaterial'})
class ColoredSpriteMaterial extends Sein.RawShaderMaterial {
  public isBillboard: boolean;
  public game: Sein.Game;

  constructor(options: {
    uniforms: {
      u_texture?: {value: Sein.Texture},
      u_uvMatrix?: {value: Sein.Matrix3},
      u_opacity?: {value: number},
      u_color: {value: Sein.Color}
    }
  }) {
    super({
      side: Sein.Constants.FRONT_AND_BACK,
      alphaMode: 'BLEND',
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_modelViewProjectionMatrix: 'SPRITEMODELVIEWPROJECTION',
        ...options.uniforms
      },
      vs: `
      precision HILO_MAX_VERTEX_PRECISION float;
      attribute vec3 a_position;
      attribute vec2 a_uv;
      uniform mat4 u_modelViewProjectionMatrix;
      uniform mat3 u_uvMatrix;

      varying vec2 v_uv;
      
      void main() {
        v_uv = (u_uvMatrix * vec3(a_uv, 1.)).xy;
      
        gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);
      }
      `,
      fs:  `
      precision HILO_MAX_FRAGMENT_PRECISION float;
      uniform sampler2D u_texture;
      uniform float u_opacity;
      uniform vec4 u_color;
      
      varying vec2 v_uv;
      
      void main() {
        vec4 color = texture2D(u_texture, v_uv) * u_color;
        color.a *= u_opacity;
      
        gl_FragColor = color;
      }
      `
    });
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'Texture', name: 'sprite.jpg', url: getStaticAssetUrl('/assets/paradise.jpg'), flipY: true});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.addActor('sprite', Sein.SpriteActor, {
      width: 1, height: 1,
      texture: game.resource.get<'Texture'>('sprite.jpg'),
      position: new Sein.Vector3(0, 0, 0),
      materialOptions: {blendSrc: Sein.Constants.SRC_ALPHA},
      material: new ColoredSpriteMaterial({
        uniforms: {
          u_color: {value: new Sein.Color(1, 0, 0, 1)}
        }
      })
    });

    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, -2)});
  }
}
