/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:24:13 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {IMaterialUniform} from '../Material/ShaderChunk';
import Game from '../Core/Game';

export type IMaterial = Hilo3d.IMaterial;

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
