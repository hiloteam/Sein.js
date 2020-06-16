/**
 * @File   : ShaderChunk.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/20/2018, 2:34:01 PM
 * @Description:
 */
import Texture from '../Texture/Texture';
import CubeTexture from '../Texture/CubeTexture';
import {Vector2, Vector3, Vector4, Matrix3, Matrix4, Color, SphericalHarmonics3} from '../Core/Math';
import {ISemanticObject} from './Semantic';
import Hilo3d from '../Core/Hilo3d';

/**
 * 可用的attribute的预定义的semantic。
 */
export type TMaterialSemanticAttribute<TExtraSemantic extends string> = 'POSITION' | 'NORMAL' | 'TANGENT'
  | 'TEXCOORD_0' | 'TEXCOORD_1' | 'COLOR_0' | 'SKININDICES' | 'SKINWEIGHTS' | TExtraSemantic;

/**
 * 自定义的attribute在`Geometry`中的名字。
 */
export interface IMaterialAttribute {
  name: string;
}

/**
 * 可用的uniform的预定义的semantic。
 */
export type TMaterialSemanticUniforms<
  TExtraSemantic extends string = ''
> = 
  'LOCAL' | 'MODEL' | 'VIEW' | 'PROJECTION' | 'VIEWPROJECTION' |
  'MODELINVERSE' | 'VIEWINVERSE' | 'PROJECTIONINVERSE' | 'SPRITEMODELVIEWPROJECTION' |
  'MODELVIEWINVERSETRANSPOSE' | 'MODELVIEW' | 'MODELVIEWPROJECTION' | 'LOGDEPTH'
  // light
  | 'AMBIENTLIGHTSCOLOR' | 'DIRECTIONALLIGHTSCOLOR' | 'DIRECTIONALLIGHTSINFO' | 'DIRECTIONALLIGHTSSHADOWMAP'
  | 'DIRECTIONALLIGHTSSHADOWMAPSIZE' | 'DIRECTIONALLIGHTSSHADOWBIAS' | 'DIRECTIONALLIGHTSPACEMATRIX'
  | 'POINTLIGHTSPOS' | 'POINTLIGHTSCOLOR' | 'POINTLIGHTSINFO'| 'POINTLIGHTSSHADOWBIAS'
  | 'POINTLIGHTSSHADOWMAP' | 'POINTLIGHTSPACEMATRIX' | 'POINTLIGHTCAMERA'
  | 'SPOTLIGHTSPOS' | 'SPOTLIGHTSDIR' | 'SPOTLIGHTSCOLOR' | 'SPOTLIGHTSCUTOFFS' | 'SPOTLIGHTSINFO'
  | 'SPOTLIGHTSSHADOWMAP' | 'SPOTLIGHTSSHADOWMAPSIZE' | 'SPOTLIGHTSSHADOWBIAS' | 'SPOTLIGHTSPACEMATRIX'
  | 'AREALIGHTSPOS' | 'AREALIGHTSCOLOR' | 'AREALIGHTSWIDTH' | 'AREALIGHTSHEIGHT' | 'AREALIGHTSLTCTEXTURE1' | 'AREALIGHTSLTCTEXTURE2'
  // joint
  | 'JOINTMATRIX' | 'JOINTMATRIXTEXTURE' | 'JOINTMATRIXTEXTURESIZE'
  // quantization
  | 'POSITIONDECODEMAT' | 'NORMALDECODEMAT' | 'UVDECODEMAT' | 'UV1DECODEMAT'
  // morph
  | 'MORPHWEIGHTS' | 'NORMALMAPSCALE' | 'EMISSION' | 'TRANSPARENCY'
  // uv matrix
  | 'UVMATRIX_0' | 'UVMATRIX_1'
  // other info
  | 'FOGCOLOR' | 'FOGINFO' | 'ALPHACUTOFF' | 'EXPOSURE' | 'GAMMAFACTOR' | TExtraSemantic;

/**
 * 自定义的uniform的值。
 */
export interface IMaterialUniform {
  value: Texture | CubeTexture | number | number[] | SphericalHarmonics3 | Vector2 | Vector3 | Vector4 | Matrix3 | Matrix4 | Color | Hilo3d.TypedArray;
  isGlobal?: boolean;
}

/**
 * 着色器片段的一个可选项，头部`header`和逻辑`main`会分开插入到最终的shader中。
 */
export interface IShaderChunkCode {
  header: string;
  main: string;
}

/**
 * ShaderChuck的接口。
 */
export interface IShaderChunk<TExtraUniformSemantic extends string = '', TExtraAttributeSemantic extends string = ''> {
  /**
   * 需求的前置`attributes`，用于多个`chuck`共用的`attributes`，防止重复。
   */
  requiredAttributes: string[];
  /**
   * 需求的前置`uniforms`，用于多个`chuck`共用的`uniforms`，防止重复。
   */
  requiredUniforms: string[];
  /**
   * chuck两个着色器共有的宏，将会添加到两个着色器的开头。
   */
  defines: string;
  /**
   * chuck独有的的attributes属性。
   */
  attributes: {[name: string]: IMaterialAttribute | TMaterialSemanticAttribute<TExtraAttributeSemantic>};
  /**
   * chuck独有的的uniforms属性。
   */
  uniforms: {[name: string]: ISemanticObject | IMaterialUniform | TMaterialSemanticUniforms<TExtraUniformSemantic>};
  /**
   * chuck的顶点着色器。
   */
  vs: IShaderChunkCode;
  /**
   * chuck的片段着色器。
   */
  fs: IShaderChunkCode;
}

/**
 * 判断一个实例是否为`ShaderChunk`。
 */
export function isShaderChunk(value: any): value is ShaderChunk {
  return (value as ShaderChunk).isShaderChuck;
}

/**
 * Shader材质块类，可用于shader复用，快速拼接效果。
 * 详细使用间[Material](../../guide/material)。
 * 
 * @template IOptions 初始化参数类型。
 * @noInheritDoc
 */
export default class ShaderChunk<
  IOptions = {},
  TExtraAttributeSemantic extends string = '',
  TExtraUniformSemantic extends string = ''
> implements IShaderChunk<TExtraUniformSemantic, TExtraAttributeSemantic> {
  public isShaderChuck = true;
  /**
   * 顶点着色器函数入口名称，若指定并使用了`MixChunkChuck`，则会在最后的shader中调用。
   */
  public vsEntryName: string = '';
  /**
   * 片段着色器主函数入口名称，若指定并使用了`MixChunkChuck`，则会在最后的shader中调用。
   */
  public fsEntryName: string = '';
  /**
   * 此chuck主函数是否拥有顶点着色器的输出。
   */
  public hasVsOut: boolean = false;
  /**
   * 此chuck主函数是否拥有片段着色器的输出。
   */
  public hasFsOut: boolean = false;
  /**
   * 需求的前置`attributes`，用于多个`chuck`共用的`attributes`，防止重复。
   * 仅在开发阶段会被检查。
   */
  public requiredAttributes: IShaderChunk['requiredAttributes'];
  /**
   * 需求的前置`uniforms`，用于多个`chuck`共用的`uniforms`，防止重复。
   * 仅在开发阶段会被检查。
   */
  public requiredUniforms: IShaderChunk['requiredUniforms'];
  /**
   * chuck两个着色器共有的宏，将会添加到两个着色器的开头。
   */
  public defines: IShaderChunk['defines'];
  /**
   * chuck独有的的attributes属性。
   */
  public attributes: IShaderChunk<TExtraUniformSemantic, TExtraAttributeSemantic>['attributes'];
  /**
   * chuck独有的的uniforms属性。
   */
  public uniforms: IShaderChunk<TExtraUniformSemantic, TExtraAttributeSemantic>['uniforms'];
  /**
   * chuck的顶点着色器。
   */
  public vs: IShaderChunk['vs'];
  /**
   * chuck的片段着色器。
   */
  public fs: IShaderChunk['fs'];

  /**
   * 构造器。
   * 
   * @param isMain 此chuck是否做为材质的最终输出。
   */
  constructor(
    public name: string,
    options?: IOptions,
    public isMain: boolean = false
  ) {
    this.requiredAttributes = [];
    this.requiredUniforms = [];
    this.attributes = {};
    this.uniforms = {};
    this.defines = '';
    this.vs = {header: '', main: ''};
    this.fs = {header: '', main: ''};

    this.onInit(name, options);
  }

  /**
   * 生命周期，将在chuck初始化的时候被调用。
   */
  public onInit(name: string, options: IOptions) {

  }
}
