/**
 * @File   : SObject.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:22:43
 * @Description:
 */
import SName from '../Core/SName';
import throwException from '../Exception/throwException';

/**
 * 判断一个实例是否为`SObject`。
 */
export function isSObject(value: any): value is SObject {
  return (value as SObject).isSObject;
}

/**
 * Sein.js的基础类，除了单纯存在于渲染引擎的实例，比如材质、几何体等，所有类都继承自`SObject`。
 * 此基类提供了基础的`uuid`计算、序列化与反序列化等标注接口。
 */
export default class SObject {
  /**
   * 实例的类名，用于反射，在类被实例化后有`object.className`作为代理。 
   */
  public static CLASS_NAME: SName = new SName('SObject');
  /**
   * 实例的类型用于反射，在类被实例化后有`object.classType`作为代理。 
   * 预留，暂时没用。
   */
  public static CLASS_TYPE: SName = new SName('SObject');
  /**
   * 存储着所有监视器装饰器`SInspect`的类与属性表。配合`inspectable`装饰器使用。
   * 
   * 每一个属性有`type`确定检视类型，不传则按照实际数据类型自动反射。
   * 而`options`则是一个在特定`type`下一个的参数。
   * 
   * 注意引擎本身不会对这个元信息做任何操作，只有引入了`seinjs-inspector`才会有效。
   */
  public static INSPECTABLE_PROPERTIES: {
    [property: string]: {
      readonly?: boolean;
      type?: string;
      options?: any
    }
  } = {};

  private static UUID: number = 0;

  protected _uuid: number;

  // for serialize and deserialize
  // user can not modify
  // public _serializableMembers: (keyof IStateTypes)[] = [];

  /**
   * 一个实例是否为SObject的判据。
   */
  public isSObject: boolean = true;
  /**
   * 实例的名字。
   */
  public name: SName;
  /**
   * 预留给编辑器（有的话）。
   * 
   * @hidden
   */
  public editable: boolean = true;

  constructor(name: string = '') {
    SObject.UUID += 1;

    this._uuid = SObject.UUID;
    this.name = new SName(name || `${(this.constructor as any).CLASS_NAME.value}-${this._uuid}`);
  }

  /**
   * 所有继承自`SObject`的类的实例的唯一ID。
   */
  get uuid(): number {
    return this._uuid;
  }

  /**
   * 实例的类名，代理到类的静态属性`CLASS_NAME`。
   */
  get className() {
    return (this.constructor as typeof SObject).CLASS_NAME;
  }

  /**
   * 实例的类型，代理到类的静态属性`CLASS_NAME`。
   * 预留，暂时没啥用。
   */
  get classType() {
    return (this.constructor as typeof SObject).CLASS_TYPE;
  }

  /**
   * 通过字符串修改实例名字。
   */
  public rename(name: string) {
    this.name = new SName(name);
  }

  /**
   * 克隆一个实例，交由子类实现。
   */
  public clone(object: this): this {
    throw new Error('Not implement.');
  }

  /**
   * 实例序列化，交由子类实现。
   * 
   * @todo: 暂未实现，预留。
   */
  public serialize(): any {
    throw new Error('Not implement.');
  }

  /**
   * 从一个json序列反序列化，交由子类实现。
   * 
   * @todo: 暂未实现，预留。
   */
  public deserialize(json: any): void {
    throw new Error('Not implement.');
  }

  /**
   * 生命周期之一，会在实例将要销毁时被触发。
   */
  public onDestroy() {

  }

  /**
   * @hidden
   */
  public destroy() {
    try {
      this.onDestroy();
    } catch (error) {
      throwException(error, this);
    }
  }
}
