/**
 * @File   : SIterable.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 5:10:56 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {TConstructor} from '../types/Common';

function isT<T extends SObject>(item: number | T): item is T {
  return (item as T).isSObject;
}

/**
 * 可迭代对象基类，Sein.js封装的用于存储`SObject`实例的特殊容器。
 * 一般使用此基类的子类，不直接使用自身。
 * 
 * @template T 存储的实例的类型。
 */
export default class SIterable<T extends SObject = SObject> {
  protected _array: T[] = [];

  /**
   * 存储实例的个数。
   */
  get length() {
    return this._array.length;
  }

  /**
   * 是否为空。
   */
  get empty() {
    return this._array.length === 0;
  }

  /**
   * 从一个基本的数组实例初始化SIterable。
   */
  public fromArray(array: T[]): void {
    throw new Error('Not implemented');
  };

  /**
   * 对存储的所有实例进行迭代。
   * 通过回调的返回值设`true`，你可以终止迭代，这用于性能优化。
   */
  public forEach(func: (item: T) => boolean | void): this {
    const length = this.length;

    for (let index = 0; index < length; index += 1) {
      if (func(this._array[index])) {
        return this;
      }
    }

    return this;
  }

  /**
   * 清空所有存储的实例。
   */
  public clear() {
    this._array = [];

    return this;
  };

  protected addItem(item: T) {
    this._array.push(item);
  }

  protected removeItem(item: number | T) {
    let index: number;

    if (isT(item)) {
      index = this._array.indexOf(item);

      if (index < 0) {
        return;
      }
    } else {
      index = item;
      item = this._array[index];

      if (!item) {
        return;
      }
    }

    this._array.splice(index, 1);
  }

  /**
   * 根据类来查找第一个实例。
   */
  public findByClass<TItem extends T = T>(Class: TConstructor<TItem>): TItem {
    return this.findByFilter<TItem>(item => item.className.equalsTo(Class.CLASS_NAME));
  }

  /**
   * 根据类来查找所有实例。
   * 
   * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
   */
  public findAllByClass<TItem extends T = T>(
    Class: TConstructor<TItem>,
    stopFinding?: (item: T, items?: TItem[]) => boolean | void
  ): TItem[] {
    return this.findAllByFilter<TItem>(item => item.className.equalsTo(Class.CLASS_NAME), stopFinding);
  }

  /**
   * 根据类型来查找第一个实例。
   */
  public findByClassType<TItem extends T = T>(classType: string): TItem {
    return this.findByFilter<TItem>(item => item.classType.equalsTo(classType));
  }

  /**
   * 根据类型来查找所有实例。
   * 
   * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
   */
  public findAllByClassType<TItem extends T = T>(
    classType: string,
    stopFinding?: (item: T, items?: TItem[]) => boolean | void
  ): TItem[] {
    return this.findAllByFilter<TItem>(item => item.classType.equalsTo(classType), stopFinding);
  }

  /**
   * 通过名字查找第一个实例。
   */
  public findByName<TItem extends T = T>(name: string): TItem {
    return this.findByFilter<TItem>(item => item.name.equalsTo(name));
  }

  /**
   * 通过名字查找所有实例。
   * 
   * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
   */
  public findAllByName<TItem extends T = T>(
    name: string,
    stopFinding?: (item: T, items?: TItem[]) => boolean | void
  ): TItem[] {
    return this.findAllByFilter<TItem>(item => item.name.equalsTo(name), stopFinding);
  }

  /**
   * 根据给定的filter函数来查找第一个实例。
   */
  public findByFilter<TItem extends T = T>(filter: (item: T) => boolean): TItem {
    let element: TItem = null;
    this.forEach(ele => {
      if (filter(ele)) {
        element = ele as TItem;

        return true;
      }
    });

    return element;
  }

  /**
   * 根据给定的filter函数来查找所有实例。
   * 
   * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
   */
  public findAllByFilter<TItem extends T = T>(
    filter: (item: T) => boolean,
    stopFinding?: (item: T, items?: TItem[]) => boolean | void
  ): TItem[] {
    const result = [];

    this.forEach(ele => {
      if (filter(ele)) {
        result.push(ele as TItem);

        if (stopFinding && stopFinding(ele, result)) {
          return true;
        }
      }
    });

    return result;
  }

  /**
   * 序列化，尚未实现。
   * 
   * @hidden
   */
  public serialize(): any {
    throw new Error('Not implemented');
  };

  /**
   * 反序列化，尚未实现。
   * 
   * @hidden
   */
  public deserialize(json: any) {
    throw new Error('Not implemented');
  };
}
