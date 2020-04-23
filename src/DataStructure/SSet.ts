/**
 * @File   : SSet.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 3:49:55 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import SIterable from '../DataStructure/SIterable';

/**
 * Sein.js封装的用于存储`SObject`实例的特殊Set容器。
 * 通过实例的`uuid`表征唯一性。
 * 
 * @template T 存储的实例的类型。
 */
export default class SSet<T extends SObject> extends SIterable<T> {
  protected _table: {[uuid: number]: T} = {};

  /**
   * 添加一个实例到SArray中。
   */
  public add(item: T) {
    if (this._table[item.uuid]) {
      return;
    }

    this.addItem(item);
    this._table[item.uuid] = item;

    return this;
  }

  /**
   * 从容器中移除一个实例。
   */
  public remove(item: T) {
    if (!this._table[item.uuid]) {
      return;
    }

    this.removeItem(item);
    delete this._table[item.uuid];

    return this;
  }

  /**
   * 清空所有存储的实例。
   */
  public clear() {
    super.clear();
    this._table = {};

    return this;
  }

  /**
   * 从一个基本的数组实例初始化SIterable。
   */
  public fromArray(array: T[]) {
    this.clear();

    const length = array.length;

    for (let index = 0; index < length; index += 1) {
      this.add(array[index]);
    }

    return this;
  }
}
