/**
 * @File   : Decorator.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/10/8 上午10:42:39
 * @Description:
 */
import SObject from '../Core/SObject';
import SName from '../Core/SName';
import {MetaSClasses, MetaSMaterials} from '../Core/MetaTypes';
import {TConstructor} from '../types/Common';
import Material from '../Material/Material';
import Debug from '../Debug';

/* tslint:disable */
/**
 * 装饰器，用于指定一个继承自`SObject`的类的类名和类型，并将其添加到全局的元信息中。
 */
export function SClass(options: {
  className: string,
  classType?: string
}) {
  return function Decorator<TClass extends TConstructor<SObject>>(constructor: TClass): TClass {
    const Class = constructor;
    Class.CLASS_NAME = new SName(options.className);

    if (options.classType) {
      Class.CLASS_TYPE = new SName(options.classType);
    }

    return MetaSClasses[options.className] = Class;
  }
}

/**
 * 装饰器，用于指定一个继承自`RawShaderMaterial`的类的类名，并将其添加到全局的元信息中。
 */
export function SMaterial(options: {
  className: string
}) {
  return function Decorator<TMaterialClass extends {new(...args: any[]): Material}>(constructor: TMaterialClass): TMaterialClass {
    (constructor as any).CLASS_NAME = new SName(options.className);
    MetaSMaterials[options.className] = constructor;

    return constructor;
  }
}
/* tslint:enable */

/**
 * @hidden
 */
export function serialize(target: SObject, key: string) {
  // target._serializableMembers[key] = true;
}

/**
 * @hidden
 */
export function deprecated(target: SObject, key: string) {

}

/**
 * 装饰器，用于指定在`seinjs-inspector`中可检视的属性。
 * 
 * @param type 检视属性的类型，若不指定则会根据类型自动判断。
 * @param options 检视属性的配置，用于比如`range`这种类型指定边界。
 */
export function inspectable(type?: string, options?: any) {
  return function Decorator(target: SObject, key: string, descriptor?: PropertyDescriptor) {
    const clz = target.constructor as TConstructor<SObject>;
    if (!clz.CLASS_NAME) {
      Debug.warn(`'inspectable' decorator must be applied to property in 'SObject' with 'SClass' decorator!`);
      return;
    }

    const obj = clz.INSPECTABLE_PROPERTIES = clz.INSPECTABLE_PROPERTIES || {};
    obj[key] = {};

    if (type) {
      obj[key].type = type;
    }

    if (options) {
      obj[key].options = options;
    }

    if (descriptor && !descriptor.writable) {
      obj[key].readonly = true;
    }
  }
}
