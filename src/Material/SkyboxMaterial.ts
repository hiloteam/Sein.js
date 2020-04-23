/**
 * @File   : SkyboxMaterial.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/19/2019, 4:06:48 PM
 * @Description:
 */
import Material from '../Material/Material';
import RawShaderMaterial from '../Material/RawShaderMaterial';
import Texture from '../Texture/Texture';
import CubeTexture from '../Texture/CubeTexture';
import {Color, Matrix4} from '../Core/Math';
import {SMaterial} from '../Core/Decorator';
import Constants from '../Core/Constants';
import Shader from '../Renderer/Shader';

/**
 * 判断一个对象是否为`SkyboxMaterial`。
 */
export function isSkyboxMaterial(value: Material): value is SkyboxMaterial {
  return (value as SkyboxMaterial).isSkyboxMaterial;
}

/**
 * 默认的天空盒纹理，支持纯色、立方体纹理、全景纹理模式。
 */
@SMaterial({className: 'SkyboxMaterial'})
export default class SkyboxMaterial extends RawShaderMaterial {
  public isSkyboxMaterial = true;

  public type: 'Color' | 'Cube' | 'Panoramic' = 'Color';

  public constructor(options: {
    /**
     * 天空盒类型。
     */
    type: 'Color' | 'Cube' | 'Panoramic'
    uniforms: {
      /**
       * 天空盒颜色。
       */
      u_color: {value: Color},
      /**
       * 天空盒颜色系数，一般不需要关心。
       */
      u_factor?: {value: number},
      /**
       * 天空盒纹理。
       */
      u_texture?: {value: Texture | CubeTexture},
      /**
       * 天空盒旋转角度。
       */
      u_rotation?: {value: number},
      /**
       * 天空盒曝光系数。
       */
      u_exposure?: {value: number},
      /**
       * 全景模式下的180/360，暂时没用。
       * 
       * @todo: support
       */
      u_degrees?: {value: number},
    }
  }) {
    super({
      depthMask: true,
      // 渲染非透明物体的队列中，最后渲染天空盒来保证良好的性能
      renderOrder: 9999,
      side: Constants.BACK,
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_viewProjectionMatrix: {value: new Matrix4()},
        u_texture: options.uniforms.u_texture,
        u_color: options.uniforms.u_color,
        u_rotation: options.uniforms.u_rotation,
        u_factor: options.uniforms.u_factor || {value: 1},
        u_exposure: options.uniforms.u_exposure,
        u_degrees: options.uniforms.u_degrees
      },
      vs: `
precision highp float;

attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat4 u_viewProjectionMatrix;

varying vec2 v_uv;

#ifdef SKYBOX_CUBE
varying vec3 v_position;
#endif

void main()
{
  #ifdef SKYBOX_CUBE
  v_position = a_position.xyz;
  #endif
  vec4 pos = u_viewProjectionMatrix * vec4(a_position, 1.0);
  gl_Position = pos.xyww;
  v_uv = a_uv;
}
      `,
      fs: `
precision mediump float;

uniform float u_factor;
uniform vec4 u_color;

${Shader.shaders['chunk/color.frag']}
${Shader.shaders['method/encoding.glsl']}

#ifdef SKYBOX_CUBE
uniform samplerCube u_texture;
uniform float u_exposure;
varying vec3 v_position;
#endif

#ifdef SKYBOX_PANORAMIC
uniform sampler2D u_texture;
uniform float u_exposure;
#endif

varying vec2 v_uv;

vec3 decodeRGBD(vec4 color) {
  return color.rgb / color.a;
}

void main()
{
  vec4 color = vec4(1., 1., 1., 1.);

  #ifdef SKYBOX_CUBE
  vec3 tex = decodeRGBD(textureCube(u_texture, v_position));
  #endif

  #ifdef SKYBOX_PANORAMIC
  vec3 tex = decodeRGBD(texture2D(u_texture, v_uv));
  #endif

  #ifdef HILO_GAMMA_CORRECTION
  tex = sRGBToLinear(tex);
  #endif
  color.rgb = tex * u_color.rgb * u_exposure * u_factor;

  ${Shader.shaders['chunk/frag_color.frag']}
}     
      `
    });
    this.type = options.type;
  }

  public getCustomRenderOption(options: any) {
    if (this.type === 'Cube') {
      options.SKYBOX_CUBE = 1;
    } else if (this.type === 'Panoramic') {
      options.SKYBOX_PANORAMIC = 1;
    } else {
      options.SKYBOX_COLOR = 1;
    }

    return options;
  }
}
