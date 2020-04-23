/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/16/2018, 1:08:04 PM
 * @Description:
 */
import RawShaderMaterial from '../Material/RawShaderMaterial';
import Texture from '../Texture/Texture';
import Constants from '../Core/Constants';
import Material from '../Material/Material';
import {Matrix3} from '../Core/Math';
import {SMaterial} from '../Core/Decorator';
import Game from '../Core/Game';
import Shader from '../Renderer/Shader';

/**
 * `SpriteMaterial`的初始化参数类型。
 */
export interface ISpriteMaterialOptions {
  uniforms: {
    u_texture?: {value: Texture},
    u_uvMatrix?: {value: Matrix3},
    u_opacity?: {value: number}
  }
}

/**
 * 判断一个实例是否为`SpriteMaterial`。
 */
export function isSpriteMaterial(value: Material): value is SpriteMaterial {
  return (value as SpriteMaterial).isSpriteMaterial;
}

/**
 * 用于2D精灵的材质。
 * 
 * @noInheritDoc
 */
@SMaterial({className: 'SpriteMaterial'})
export default class SpriteMaterial extends RawShaderMaterial {
  public isSpriteMaterial = true;

  /**
   * ***不要自己使用！*
   * 
   * 是否是公告牌。
   * 
   * @hidden
   */
  public isBillboard: boolean;
  public game: Game;

  constructor(options: ISpriteMaterialOptions) {
    super({
      side: Constants.FRONT_AND_BACK,
      alphaMode: 'BLEND',
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_modelViewProjectionMatrix: 'SPRITEMODELVIEWPROJECTION',
        u_modelViewMatrix: 'MODELVIEW',
        u_fogInfo: 'FOGINFO',
        u_fogColor: 'FOGCOLOR',
        ...options.uniforms
      },
      vs: `
      precision HILO_MAX_VERTEX_PRECISION float;
      attribute vec3 a_position;
      attribute vec2 a_uv;
      uniform mat4 u_modelViewProjectionMatrix;
      uniform mat3 u_uvMatrix;
      ${Shader.shaders['chunk/lightFog.vert']}
      varying vec2 v_uv;
      
      void main() {
        vec4 pos = vec4(a_position, 1.0);
        v_uv = (u_uvMatrix * vec3(a_uv, 1.)).xy;
        ${Shader.shaders['chunk/lightFog_main.vert']}
      
        gl_Position = u_modelViewProjectionMatrix * pos;
      }
      `,
      fs:  `
      precision HILO_MAX_FRAGMENT_PRECISION float;
      uniform sampler2D u_texture;
      uniform float u_opacity;
      ${Shader.shaders['chunk/fog.frag']}
      varying vec2 v_uv;
      
      void main() {
        vec4 color = texture2D(u_texture, v_uv);
        float a = color.a;
        ${Shader.shaders['chunk/fog_main.frag']}
        color.a = a * u_opacity;
      
        gl_FragColor = color;
      }
      `
    });
  }
}
