/**
 * @File   : EventManager.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午11:28:34
 * @Description:
 */
import SObject from '../Core/SObject';
import Observable from '../Core/Observable';
import Game from '../Core/Game';
import {ISeinEvent} from '../types/Event';
import {SClass} from '../Core/Decorator';
import EventTrigger from '../Event/EventTrigger';
import {TConstructor} from '../types/Common';
import MissingMemberException from '../Exception/MissingMemberException';
import Debug from '../Debug';
import throwException from '../Exception/throwException';
import SName from '../Core/SName';

type TCallback<TParams> = (params?: TParams) => void;

/**
 * 判断一个实例是否为`EventManager`。
 */
export function isEventManager(value: SObject): value is EventManager {
  return (value as EventManager).isEventManager;
}

/**
 * 事件管理器类。作为事件的集中管理容器，承担着引擎绝大多数部分的事件注册、分发。
 * 
 * @template IDefaultEvents 用于标注所有事件的名称以及对应的事件参数类型。
 * @noInheritDoc
 */
@SClass({className: 'EventManager', classType: 'EventManager'})
export default class EventManager<IDefaultEvents extends any = {}> extends SObject {
  public isEventManager = true;

  protected _observables: {[type: string]: Observable} = {};
  protected _triggers: {[type: string]: EventTrigger} = {};
  protected _caches: {[type: string]: ISeinEvent} = {};
  protected _objHasGame: {getGame(): Game, onError: (...any: any[]) => void} = null;

  /**
   * @param objHasGame 拥有`getGame()`方法和`onError`方法的对象。
   */
  constructor(objHasGame: {name?: SName, getGame(): Game, onError: (...any: any[]) => void} = null) {
    super(objHasGame.name.value);

    this._objHasGame = objHasGame;
  }

  /**
   * 获取自身的父级实例引用，一般不需要自己使用。
   */
  get parent(): {getGame(): Game, onError: (...any: any[]) => void} {
    return this._objHasGame;
  }

  /**
   * @hidden
   */
  public getGame(): Game {
    return this._objHasGame.getGame();
  }

  /**
   * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError() {

  }

  /**
   * 注册一个事件，若指定了`TriggerClass`，则事件的分发将会全权交由触发器来管理。
   * 事件触发器的详情请见[EventTrigger](../eventtrigger)。
   */
  public register<TKey extends keyof IDefaultEvents>(type: TKey, TriggerClass?: TConstructor<EventTrigger<IDefaultEvents[TKey]>>): this;
  public register<TEvent extends ISeinEvent = ISeinEvent>(type: string, TriggerClass?: TConstructor<EventTrigger<TEvent>>): this;
  public register<TEvent extends ISeinEvent = ISeinEvent>(type: string, TriggerClass?: TConstructor<EventTrigger<TEvent>>): this {
    if (this._observables[type]) {
      Debug.warn(`Event ${type} is already registered, before re-register, please unregister it at first !`);
      return this;
    }

    this._observables[type] = new Observable<TEvent>(this, type);
    this._observables[type].onEmpty = () => {
      if (this._triggers[type] && !this._triggers[type].paused) {
        this._triggers[type].pause();
      }
    };

    if (TriggerClass) {
      this._triggers[type] = new TriggerClass(type, this, this.getGame());
    }

    return this;
  }

  /**
   * 取消注册一个事件。
   */
  public unregister<TKey extends keyof IDefaultEvents>(type: TKey): this;
  public unregister(type: string): this;
  public unregister(type: string): this {
    if (!this._observables[type]) {
      return this;
    }

    delete this._observables[type];

    if (this._triggers[type]) {
      this._triggers[type].destroy();
      delete this._triggers[type];
    }

    return this;
  }

  /**
   * 添加一个事件监听器。
   * **若监听时此事件尚未注册，会自动注册此事件！**
   */
  public add<TKey extends keyof IDefaultEvents>(type: TKey, callback: TCallback<IDefaultEvents[TKey]>, priority?: number): this;
  public add<TEvent extends ISeinEvent = ISeinEvent>(type: string, callback: TCallback<TEvent>, priority?: number): this;
  public add<TEvent extends ISeinEvent = ISeinEvent>(type: string, callback: TCallback<TEvent>, priority?: number): this {
    if (!this._observables[type as string]) {
      this.register(type);
    }

    this._observables[type as string].add(callback, priority);

    if (this._triggers[type] && this._triggers[type].paused) {
      this._triggers[type].begin();
    }

    return this;
  }

  /**
   * 添加一个事件监听器，触发一次后自动移除。
   */
  public addOnce<TKey extends keyof IDefaultEvents>(type: TKey, callback: TCallback<IDefaultEvents[TKey]>, priority?: number): this;
  public addOnce<TEvent extends ISeinEvent = ISeinEvent>(type: string, callback: TCallback<TEvent>, priority?: number): this;
  public addOnce<TEvent extends ISeinEvent = ISeinEvent>(type: string, callback: TCallback<TEvent>, priority?: number): this {
    if (!this._observables[type as string]) {
      this.register(type);
    }

    (this._observables[type] as Observable<TEvent>).addOnce(callback, priority);

    if (this._triggers[type] && this._triggers[type].paused) {
      this._triggers[type].begin();
    }

    return this;
  }

  /**
   * 移除一个事件监听器。
   */
  public remove<TKey extends keyof IDefaultEvents>(type: TKey, callback: TCallback<IDefaultEvents[TKey]>): this;
  public remove<TEvent extends ISeinEvent = ISeinEvent>(type: string, callback: TCallback<TEvent>): this;
  public remove<TEvent extends ISeinEvent = ISeinEvent>(type: string, callback: TCallback<TEvent>): this {
    if (!this._observables[type as string]) {
      return this;
    }

    (this._observables[type] as Observable<TEvent>).remove(callback);

    return this;
  }

  /**
   * 判断一个事件是否被注册。
   */
  public has(type: string): boolean {
    return !!this._observables[type];
  }

  /**
   * 判断一个时间的监听者数量。
   */
  public getCount(type: string): number {
    if (!this.has(type)) {
      return 0;
    }

    return this._observables[type].count;
  }

  /**
   * 清空所有事件。
   */
  public clear<TKey extends keyof IDefaultEvents>(type: TKey): this;
  public clear(type: string): this {
    if (!this._observables[type as string]) {
      throwException(
        new MissingMemberException(this, 'Event', type, this),
        this
      );
    }

    this._observables[type].clear();

    return this;
  }

  /**
   * 触发一个**已注册**的事件。
   * 
   * @param immediately 是否要将事件立即分发，如果不则会先缓存，之后在每一帧更新前统一分发，避免不必要的分发。这通常用于HID性能优化。
   */
  public trigger<TKey extends keyof IDefaultEvents>(type: TKey, event: IDefaultEvents[TKey], immediately?: boolean): this;
  public trigger<TEvent extends ISeinEvent = ISeinEvent>(type: string, event?: TEvent, immediately?: boolean): this;
  public trigger<TEvent extends ISeinEvent = ISeinEvent>(type: string, event?: TEvent, immediately: boolean = true): this {
    if (!this._observables[type as string]) {
      throwException(
        new MissingMemberException(this, 'Event', type, this, 'Register it before trigger !'),
        this
      );
    }

    if (immediately || this.getGame().paused) {
      this._observables[type as string].notify(event);
      return this;
    }

    this._caches[type] = event;

    return this;
  }

  /**
   * 分发某个缓存的事件，一般不需要自行触发。
   */
  public flush<TKey extends keyof IDefaultEvents>(type: TKey): this;
  public flush(type: string): this {
    if (!this._observables[type as string]) {
      throw new MissingMemberException(this, 'Event', type, this, 'Register it before flush !');
    }

    const event = this._caches[type];

    if (event) {
      delete this._caches[type];

      this._observables[type as string].notify(event);
    }

    return this;
  }

  /**
   * 分发所有缓存的事件，一般不需要自行触发。
   */
  public flushAll(): this {
    for (const type in this._caches) {
      this.flush(type);
    }

    return this;
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    for (const type in this._triggers) {
      this._triggers[type].destroy();
    }
  }
}
