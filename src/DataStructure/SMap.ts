/**
 * @File   : SMap.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 4:44:07 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import SIterable from '../DataStructure/SIterable';

/**
 * Sein.js封装的用于存储`SObject`实例的特殊Map容器。
 * 
 * @template T 存储的实例的类型。
 */
export default class SMap<T extends SObject> extends SIterable<T> {
  protected _table: {[key: string]: T} = {};
  protected _tableReflect: {[uuid: number]: string} = {};

  /**
   * 原始基础数组。
   */
  get array() {
    return this._array;
  }

  /**
   * 设置对应键的实例引用。
   */
  public set(key: string, item: T) {
    const oldItem = this._table[key];

    if (oldItem) {
      this.removeItem(oldItem);
      delete this._tableReflect[oldItem.uuid];
    }

    this.addItem(item);
    this._table[key] = item;
    this._tableReflect[item.uuid] = key;

    return this;
  }

  /**
   * 判断键是否在容器内。
   */
  public has(key: string): boolean {
    return !!this._table[key];
  }

  /**
   * 通过键从容器中移除一个实例。
   */
  public remove(key: string): T {
    const oldItem = this._table[key];

    if (!oldItem) {
      return;
    }

    this.removeItem(oldItem);
    delete this._table[key];
    delete this._tableReflect[oldItem.uuid];

    return oldItem;
  }

  /**
   * 通过键获取一个实例。
   */
  public get<TItem extends T = T>(key: string): TItem {
    return this.findByName<TItem>(key);
  }

  /**
   * 通过索引从容器中获取一个实例。
   */
  public getAtIndex<TItem extends T = T>(index: number): TItem {
    return this._array[index] as TItem;
  }

  /**
   * 清空所有存储的实例。
   */
  public clear() {
    super.clear();
    this._table = {};
    this._tableReflect = {};

    return this;
  }

  /**
   * 遍历所有键值对。
   * 通过回调的返回值设`true`，你可以终止迭代，这用于性能优化。
   */
  public forEachEntities(func: (key: string, item: T) => boolean | void): this {
    const length = this.length;

    for (let index = 0; index < length; index += 1) {
      const item = this._array[index];
      if (func(this._tableReflect[item.uuid], item)) {
        return this;
      }
    }

    return this;
  }

  /**
   * 从一个基本的数组实例初始化SIterable。
   */
  public fromArray(array: T[]) {
    this.clear();

    const length = array.length;

    for (let index = 0; index < length; index += 1) {
      this.set(array[index].name.value, array[index]);
    }

    return this;
  }

  /**
   * 通过名字查找第一个实例。
   */
  public findByName<TItem extends T = T>(name: string): TItem {
    return this._table[name] as TItem;
  }

  /**
   * 通过名字查找所有实例。
   */
  public findAllByName<TItem extends T = T>(name: string): TItem[] {
    return [this._table[name] as TItem];
  }
}
