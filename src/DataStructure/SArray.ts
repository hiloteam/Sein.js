/**
 * @File   : SArray.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 3:50:01 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import SIterable from '../DataStructure/SIterable';

/**
 * Sein.js封装的用于存储`SObject`实例的特殊数组容器。
 * 
 * @template T 存储的实例的类型。
 */
export default class SArray<T extends SObject = SObject> extends SIterable<T> {
  protected _array: T[];

  /**
   * 原始基础数组。
   */
  get array() {
    return this._array;
  }

  /**
   * 添加一个实例到容器中。
   */
  public add(item: T) {
    this.addItem(item);

    return this;
  }

  /**
   * 从容器中移除一个实例。
   */
  public remove(item: T | number) {
    this.removeItem(item);

    return this;
  }

  /**
   * 修改`index`索引处的实例。
   */
  public set<TItem extends T = T>(index: number, value: TItem): this {
    this._array[index] = value;

    return this;
  }

  /**
   * 在`index`索引处后方插入一个实例。
   */
  public insert<TItem extends T = T>(index: number, value: TItem): this {
    this._array.splice(index, 0, value);

    return this;
  }

  /**
   * 获取`index`索引处的实例引用。
   */
  public get<TItem extends T = T>(index: number): TItem {
    return this._array[index] as TItem;
  }

  /**
   * 释放容器队列中的最后一个实例。
   */
  public pop<TItem extends T = T>(): TItem {
    const length = this.length;
    const item = this._array[length];
    this.removeItem(length);

    return item as TItem;
  }

  /**
   * 查找实例在容器中的索引。
   */
  public indexOf(item: T) {
    return this._array.indexOf(item);
  }

  /**
   * 合并当前和另一个容器。
   */
  public merge(array: SArray<T>) {
    Array.prototype.push.apply(this._array, array._array);

    return this;
  }

  /**
   * 从另一个容器复制数据。
   */
  public copy(array: SArray<T>) {
    this._array = array.array.slice();

    return this;
  }

  /**
   * 从一个基本的数组实例初始化SIterable。
   */
  public fromArray(array: T[]) {
    this._array = array.slice();

    return this;
  }
}
