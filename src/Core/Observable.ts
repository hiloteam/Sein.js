/**
 * @File   : Observable.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/29 下午7:36:42
 * @Description:
 */
import throwException from '../Exception/throwException';
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';

/**
 * 判断一个实例是否为`Observable`。
 */
export function isObservable(value: any): value is Observable {
  return (value as Observable).isObservable;
}

/**
 * 可观察对象，事件机制的底层基础，维护一个观察回调队列。
 * 
 * @template 队列中回调的参数类型。
 */
@SClass({className: 'Observable'})
export default class Observable<TParams extends Object = any> extends SObject {
  public isObservable = true;
  /**
   * 当队列从非空变为空时将会被触发的回调。
   */
  public onEmpty: () => void = () => {};
  /**
   * 父级SObject实例。
   */
  public parent: SObject = null;

  private _index: number = 0;
  private _length: number = 0;
  private _queue: ({
    callback: (params: TParams) => void | boolean;
    isOnce: boolean;
  })[] = [];

  /**
   * 拥有的监听者数量。
   */
  get count() {
    return this._queue.length;
  }

  /**
   * @param parent 可选，用于构造异常链。
   * @param name 可选，用于指定名字。
   */
  constructor(parent?: SObject, name?: string) {
    super(name);

    this.parent = parent;
  }

  /**
   * 添加一个回调到队列中。
   */
  public add(callback: (params: TParams) => void | boolean, priority?: number) {
    if (priority !== undefined) {
      this._queue.splice(priority, 0, {callback, isOnce: false});
    } else {
      this._queue.push({callback, isOnce: false});
    }

    return this;
  }

  /**
   * 添加一个回调到队列中，并再被触发执行一次后自动移除。
   */
  public addOnce(callback: (params: TParams) => void | boolean, priority?: number) {
    if (priority !== undefined) {
      this._queue.splice(priority, 0, {callback, isOnce: true});
    } else {
      this._queue.push({callback, isOnce: true});
    }

    return this;
  }

  /**
   * 清空队列。
   */
  public clear() {
    this._queue = [];

    this.onEmpty();

    return this;
  }

  /**
   * 从队列中移除一个回调。
   */
  public remove(callback: (params: TParams) => void | boolean) {
    const length = this._queue.length;
    let index = -1;

    for (let i = 0; i < length; i += 1) {
      if (this._queue[i].callback === callback) {
        index = i;
      }
    }

    if (index < 0) {
      return;
    }

    this._queue.splice(index, 1);

    // Guard: If remove a handler while notify
    this._index -= 1;
    this._length -= 1;

    if (length === 1) {
      this.onEmpty();
    }

    return this;
  }

  /**
   * 通过一个参数触发一次广播，调用所有回调。
   */
  public notify(params: TParams) {
    this._index = 0;
    this._length = this._queue.length;

    while (this._index < this._length) {
      const {callback, isOnce} = this._queue[this._index];

      if (isOnce) {
        this._queue.splice(this._index, 1);
        this._length -= 1;
      } else {
        this._index += 1;
      }

      try {
        if(callback(params) === true) {
          return this;
        }
      } catch (error) {
        throwException(error, this);
      }
    }

    return this;
  }
}
