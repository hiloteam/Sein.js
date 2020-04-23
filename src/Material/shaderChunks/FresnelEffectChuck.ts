/**
 * @File   : FresnelEffectChuck.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/21/2018, 10:36:41 AM
 * @Description:
 */
import ShaderChunk, {IShaderChunk} from '../../Material/ShaderChunk';
import {Color} from '../../Core/Math';

/**
 * @hidden
 */
const requiredAttributes: IShaderChunk['requiredAttributes'] = [
  'a_position',
  'a_normal',
  'a_texcoord0'
];

/**
 * @hidden
 */
const requiredUniforms: IShaderChunk['requiredUniforms'] = [
  'u_normalMatrix',
  'u_viewVector'
];

/**
 * @hidden
 */
const uniforms: IShaderChunk['uniforms'] = {
  u_fresnelC: {value: 1},
  u_fresnelP: {value: 1},
  u_fresnelColor: {value: new Color(1, 1, 1, 1)}
};

/**
 * @hidden
 */
const vs = {
  header: `
uniform vec3 u_viewVector;
uniform float u_fresnelC;
uniform float u_fresnelP;

varying vec2 v_fresnelUv;
varying float v_fresnelIntensity;
  `,
  main: `
void fresnelEffect() {
  vec3 v_normal = normalize(u_normalMatrix * a_normal);
  vec3 v_view = normalize(u_normalMatrix * u_viewVector);

  v_fresnelIntensity = pow(u_fresnelC - dot(v_normal, v_view), u_fresnelP);
  v_fresnelUv = a_texcoord0;
}  
  `
};

/**
 * @hidden
 */
const fs = {
  header: `
uniform vec4 u_fresnelColor;

varying float v_fresnelIntensity;
varying vec2 v_fresnelUv;
  `,
  main: `
vec4 fresnelEffect() {
  vec4 glow = u_fresnelColor * v_fresnelIntensity;

  return glow;
}  
  `
};

/**
 * 菲涅尔效应chuck。
 * 
 * @noInheritDoc
 */
export default class FresnelEffectChuck extends ShaderChunk {
  public vsEntryName: string = 'fresnelEffect';
  public fsEntryName: string = 'fresnelEffect';
  public hasVsOut: boolean = false;
  public hasFsOut: boolean = true;

  public onInit() {
    this.requiredAttributes = requiredAttributes;
    this.requiredUniforms = requiredUniforms;
    this.uniforms = uniforms;
    this.vs = vs;
    this.fs = fs;
  }
}
