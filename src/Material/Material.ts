/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:24:13 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {IMaterialUniform} from '../Material/ShaderChunk';
import Game from '../Core/Game';
import Texture from '../Texture/Texture';
import {Matrix3} from '../Core/Math';

export interface IMaterial {
  /**
   * name
   */
  name?: string;
  /**
   * shader cache id
   */
  shaderCacheId?: string;
  /**
   * 光照类型
   */
  lightType?: string;
  /**
   * 是否开启网格模式
   */
  wireframe?: boolean;
  /**
   * 是否开启深度测试
   */
  depthTest?: boolean;
  /**
   * SAMPLE_ALPHA_TO_COVERAGE
   */
  sampleAlphaToCoverage?: boolean;
  /**
   * 是否开启depthMask
   */
  depthMask?: boolean;
  /**
   * 深度测试Range
   */
  depthRange?: any[];
  /**
   * 深度测试方法
   */
  depthFunc?: GLenum;
  /**
   * 法线贴图
   */
  normalMap?: Texture;
  /**
   * 视差贴图
   */
  parallaxMap?: Texture;
  /**
   * 法线贴图scale
   */
  normalMapScale?: number;
  /**
   * 是否忽略透明度
   */
  ignoreTranparent?: boolean;
  /**
   * 是否开启 gamma 矫正
   */
  gammaCorrection?: boolean;
  /**
   * 是否使用物理灯光
   */
  usePhysicsLight?: boolean;
  /**
   * 是否环境贴图和环境光同时生效
   */
  isDiffuesEnvAndAmbientLightWorkTogether?: boolean;
  /**
   * 渲染顺序数字小的先渲染（透明物体和不透明在不同的队列）
   */
  renderOrder?: number;
  /**
   * 是否预乘 alpha
   */
  premultiplyAlpha?: boolean;
  /**
   * gammaOutput
   */
  gammaOutput?: boolean;
  /**
   * gamma值
   */
  gammaFactor?: number;
  /**
   * 是否投射阴影
   */
  castShadows?: boolean;
  /**
   * 是否接受阴影
   */
  receiveShadows?: boolean;
  /**
   * uv transform eg:new Matrix3().fromRotationTranslationScale(Math.PI/2, 0, 0, 2, 2)
   */
  uvMatrix?: Matrix3;
  /**
   * uv1 transform eg:new Matrix3().fromRotationTranslationScale(Math.PI/2, 0, 0, 2, 2)
   */
  uvMatrix1?: Matrix3;
  /**
   * 是否开启 CullFace
   */
  cullFace?: boolean;
  /**
   * CullFace 类型
   */
  cullFaceType?: GLenum;
  /**
   * 显示面，可选值 FRONT, BACK, FRONT_AND_BACK
   */
  side?: GLenum;
  /**
   * 是否开启颜色混合
   */
  blend?: boolean;
  /**
   * 颜色混合方式
   */
  blendEquation?: GLenum;
  /**
   * 透明度混合方式
   */
  blendEquationAlpha?: GLenum;
  /**
   * 颜色混合来源比例
   */
  blendSrc?: GLenum;
  /**
   * 颜色混合目标比例
   */
  blendDst?: GLenum;
  /**
   * 透明度混合来源比例
   */
  blendSrcAlpha?: GLenum;
  /**
   * 透明度混合目标比例
   */
  blendDstAlpha?: GLenum;
  /**
   * 当前是否需要强制更新
   */
  isDirty?: boolean;
  /**
   * 透明度 0~1
   */
  transparency?: number;
  /**
   * 是否需要透明
   */
  transparent?: boolean;
  /**
   * 透明度剪裁，如果渲染的颜色透明度大于等于这个值的话渲染为完全不透明，否则渲染为完全透明
   */
  alphaCutoff?: number;
  /**
   * 是否使用HDR
   */
  useHDR?: boolean;
  /**
   * 曝光度，仅在 useHDR 为 true 时生效
   */
  exposure?: number;
};

/**
 * 判断一个实例是否为`Material`。
 */
export function isMaterial(value: any): value is Material {
  return (value as Material).isMaterial;
}

/**
 * **材质基类，不要直接使用！想自定义请使用`RawShaderMaterial`**
 */
export default class Material extends Hilo3d.Material {}

/**
 * @hidden
 */
declare module 'hilo3d' {
  interface Material {
    /**
     * 获取特定的Uniform实例引用，可以获取后直接用`value`来设置它。
     */
    getUniform<TValue extends IMaterialUniform['value'] = any>(key: string): {value: TValue};
    /**
     * 直接设置某个特定uniform的`value`。
     */
    setUniform<TValue extends IMaterialUniform['value'] = any>(key: string, value: TValue): this;
    /**
     * 通过一个回调函数以及其传入的uniform当前值，设置某个特定uniform的`value`。
     */
    changeUniform<TValue extends IMaterialUniform['value'] = any>(key: string, handler: (value: TValue) => TValue): this;
  }

  interface IPBRMaterial {
    /**
     * 是否在Shader中预乘Alpha。
     */
    premultiplyAlpha?: boolean;
  }

  interface PBRMaterial {
    /**
     * 是否在Shader中预乘Alpha。
     */
    premultiplyAlpha: boolean;
    /**
     * 获取特定的Uniform实例引用，可以获取后直接用`value`来设置它。
     */
    getUniform<TValue extends IMaterialUniform['value'] = any>(key: string): {value: TValue};
    /**
     * 直接设置某个特定uniform的`value`。
     */
    setUniform<TValue extends IMaterialUniform['value'] = any>(key: string, value: TValue): this;
    /**
     * 通过一个回调函数以及其传入的uniform当前值，设置某个特定uniform的`value`。
     */
    changeUniform<TValue extends IMaterialUniform['value'] = any>(key: string, handler: (value: TValue) => TValue): this;
  }

  interface IBasicMaterial {
    /**
     * 是否在Shader中预乘Alpha。
     */
    premultiplyAlpha?: boolean;
  }

  interface BasicMaterial {
    /**
     * 是否在Shader中预乘Alpha。
     */
    premultiplyAlpha: boolean;
    /**
     * 获取特定的Uniform实例引用，可以获取后直接用`value`来设置它。
     */
    getUniform<TValue extends IMaterialUniform['value'] = any>(key: string): {value: TValue};
    /**
     * 直接设置某个特定uniform的`value`。
     */
    setUniform<TValue extends IMaterialUniform['value'] = any>(key: string, value: TValue): this;
    /**
     * 通过一个回调函数以及其传入的uniform当前值，设置某个特定uniform的`value`。
     */
    changeUniform<TValue extends IMaterialUniform['value'] = any>(key: string, handler: (value: TValue) => TValue): this;
  }

  interface GeometryMaterial {
    /**
     * 获取特定的Uniform实例引用，可以获取后直接用`value`来设置它。
     */
    getUniform<TValue extends IMaterialUniform['value'] = any>(key: string): {value: TValue};
    /**
     * 直接设置某个特定uniform的`value`。
     */
    setUniform<TValue extends IMaterialUniform['value'] = any>(key: string, value: TValue): this;
    /**
     * 通过一个回调函数以及其传入的uniform当前值，设置某个特定uniform的`value`。
     */
    changeUniform<TValue extends IMaterialUniform['value'] = any>(key: string, handler: (value: TValue) => TValue): this;
  }
}

Hilo3d.Material.prototype.getUniform = function getUniform<TValue extends IMaterialUniform['value'] = any>(key: string): {value: TValue} {
  /* tslint:disable-next-line */
  const self = this as Material;

  return {
    get value() {
      return self[key] as TValue;
    },
    set value(v: TValue) {
      self.setUniform<TValue>(key, v);
    }
  };
};

Hilo3d.Material.prototype.setUniform = function setUniform<TValue extends IMaterialUniform['value'] = any>(key: string, value: TValue): Material {
  this[key] = value;

  return this;
};

Hilo3d.Material.prototype.changeUniform = function changeUniform<TValue extends IMaterialUniform['value'] = any>(
  key: string, handler: (value: TValue) => TValue
): Material {
  this[key] = handler(this[key] as TValue);

  return this;
};
