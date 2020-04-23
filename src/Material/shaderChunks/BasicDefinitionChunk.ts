/**
 * @File   : BasicDefinitionChunk.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/20/2018, 11:28:29 PM
 * @Description:
 */
import ShaderChunk, {IShaderChunk} from '../../Material/ShaderChunk';
import Hilo3d from '../../Core/Hilo3d';

/**
 * @hidden
 */
const defines = [
  Hilo3d.Shader.shaders['chunk/baseDefine.glsl'],
  '#define HILO_HAS_NORMAL 1',
  '#define HILO_HAS_TEXCOORD0 1',
  '#define HILO_HAS_TEXCOORD1 1'
].join('\n');

/**
 * @hidden
 */
const attributes: IShaderChunk['attributes'] = {
  a_position: 'POSITION',
  a_normal: 'NORMAL',
  a_tangent: 'TANGENT',
  a_texcoord0: 'TEXCOORD_0',
  a_texcoord1: 'TEXCOORD_1',
  a_color: 'COLOR_0',
  a_skinIndices: 'SKININDICES',
  a_skinWeights: 'SKINWEIGHTS'
};

['POSITION', 'NORMAL', 'TANGENT'].forEach((name) => {
  const camelName = name.slice(0, 1) + name.slice(1).toLowerCase();
  for (let i = 0; i < 8; i += 1) {
    attributes['a_morph' + camelName + i] = ('MORPH' + name + i) as any;
  }
});

/**
 * @hidden
 */
const uniforms: IShaderChunk['uniforms'] = {
  u_normalMatrix: 'MODELVIEWINVERSETRANSPOSE',
  u_modelViewMatrix: 'MODELVIEW',
  u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
  u_logDepth: 'LOGDEPTH',

  // light
  u_ambientLightsColor: 'AMBIENTLIGHTSCOLOR',
  u_directionalLightsColor: 'DIRECTIONALLIGHTSCOLOR',
  u_directionalLightsInfo: 'DIRECTIONALLIGHTSINFO',
  u_directionalLightsShadowMap: 'DIRECTIONALLIGHTSSHADOWMAP',
  u_directionalLightsShadowMapSize: 'DIRECTIONALLIGHTSSHADOWMAPSIZE',
  u_directionalLightsShadowBias: 'DIRECTIONALLIGHTSSHADOWBIAS',
  u_directionalLightSpaceMatrix: 'DIRECTIONALLIGHTSPACEMATRIX',
  u_pointLightsPos: 'POINTLIGHTSPOS',
  u_pointLightsColor: 'POINTLIGHTSCOLOR',
  u_pointLightsInfo: 'POINTLIGHTSINFO',
  u_pointLightsShadowBias: 'POINTLIGHTSSHADOWBIAS',
  u_pointLightsShadowMap: 'POINTLIGHTSSHADOWMAP',
  u_pointLightSpaceMatrix: 'POINTLIGHTSPACEMATRIX',
  u_pointLightCamera: 'POINTLIGHTCAMERA',
  u_spotLightsPos: 'SPOTLIGHTSPOS',
  u_spotLightsDir: 'SPOTLIGHTSDIR',
  u_spotLightsColor: 'SPOTLIGHTSCOLOR',
  u_spotLightsCutoffs: 'SPOTLIGHTSCUTOFFS',
  u_spotLightsInfo: 'SPOTLIGHTSINFO',
  u_spotLightsShadowMap: 'SPOTLIGHTSSHADOWMAP',
  u_spotLightsShadowMapSize: 'SPOTLIGHTSSHADOWMAPSIZE',
  u_spotLightsShadowBias: 'SPOTLIGHTSSHADOWBIAS',
  u_spotLightSpaceMatrix: 'SPOTLIGHTSPACEMATRIX',
  u_areaLightsPos: 'AREALIGHTSPOS',
  u_areaLightsColor: 'AREALIGHTSCOLOR',
  u_areaLightsWidth: 'AREALIGHTSWIDTH',
  u_areaLightsHeight: 'AREALIGHTSHEIGHT',
  u_areaLightsLtcTexture1: 'AREALIGHTSLTCTEXTURE1',
  u_areaLightsLtcTexture2: 'AREALIGHTSLTCTEXTURE2',

  // joint
  u_jointMat: 'JOINTMATRIX',
  u_jointMatTexture: 'JOINTMATRIXTEXTURE',
  u_jointMatTextureSize: 'JOINTMATRIXTEXTURESIZE',

  // quantization
  u_positionDecodeMat: 'POSITIONDECODEMAT',
  u_normalDecodeMat: 'NORMALDECODEMAT',
  u_uvDecodeMat: 'UVDECODEMAT',
  u_uv1DecodeMat: 'UV1DECODEMAT',

  // morph
  u_morphWeights: 'MORPHWEIGHTS',
  u_normalMapScale: 'NORMALMAPSCALE',
  u_emission: 'EMISSION',
  u_transparency: 'TRANSPARENCY',

  // uv matrix
  u_uvMatrix: 'UVMATRIX_0',
  u_uvMatrix1: 'UVMATRIX_1',

  // other info
  u_fogColor: 'FOGCOLOR',
  u_fogInfo: 'FOGINFO',
  u_alphaCutoff: 'ALPHACUTOFF',
  u_exposure: 'EXPOSURE',
  u_gammaFactor: 'GAMMAFACTOR'
};

/**
 * @hidden
 */
const vs = {
  header: [
    Hilo3d.Shader.shaders['chunk/extensions.vert'],
    Hilo3d.Shader.shaders['chunk/precision.vert'],
    'attribute vec3 a_position;',
    'uniform mat4 u_modelViewProjectionMatrix;',
    Hilo3d.Shader.shaders['chunk/unQuantize.vert'],
    Hilo3d.Shader.shaders['chunk/joint.vert'],
    Hilo3d.Shader.shaders['chunk/uv.vert'],
    Hilo3d.Shader.shaders['chunk/normal.vert'],
    Hilo3d.Shader.shaders['chunk/lightFog.vert'],
    Hilo3d.Shader.shaders['chunk/morph.vert'],
    Hilo3d.Shader.shaders['chunk/color.vert'],
    Hilo3d.Shader.shaders['chunk/logDepth.vert']
  ].join('\n'),
  main: ''
};

/**
 * @hidden
 */
const fs = {
  header: [
    Hilo3d.Shader.shaders['chunk/extensions.frag'],
    Hilo3d.Shader.shaders['chunk/precision.frag'],
    Hilo3d.Shader.shaders['./chunk/color.frag'],
    Hilo3d.Shader.shaders['./chunk/uv.frag'],
    Hilo3d.Shader.shaders['./chunk/normal.frag'],
    Hilo3d.Shader.shaders['./chunk/lightFog.frag'],
    Hilo3d.Shader.shaders['./chunk/light.frag'],
    Hilo3d.Shader.shaders['./chunk/transparency.frag'],
    Hilo3d.Shader.shaders['./chunk/fog.frag'],
    Hilo3d.Shader.shaders['./chunk/logDepth.frag']
  ].join('\n'),
  main: ''
};

/**
 * 基础材质定义，用于指定一些基础的材质变量。
 * `ShaderMaterial`就在`RawShaderMaterial`基础上用到了这个chuck。
 * 
 * @noInheritDoc
 */
export default class BasicDefinitionChunk extends ShaderChunk {
  public onInit() {
    this.attributes = attributes;
    this.uniforms = uniforms;
    this.defines = defines;
    this.vs = vs;
    this.fs = fs;
  }
}
