/**
 * @File   : EventTrigger.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/12/2018, 6:02:45 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {ISeinEvent} from '../types/Event';
import {SClass} from '../Core/Decorator';
import EventManager from '../Event/EventManager';
import Game from '../Core/Game';
import SName from '../Core/SName';
import throwException from '../Exception/throwException';

/**
 * 判断一个实例是否为`EventTrigger`。
 */
export function isEventTrigger(value: SObject): value is EventTrigger {
  return (value as EventTrigger).isEventTrigger;
}

/**
 * 事件触发器类。触发器用于在事件管理器[EventManager](../eventmanager)注册事件时，添加特殊的自动分发功能。
 * 你可以继承此基类来派生自己的触发器，之后触发器便会自动得完成一些特殊事件的分发工作，比如HID（用户输入）。
 * 详细例子请看[CustomTrigger](../../example/event/custom-trigger)。
 * 
 * @template TEvent 此触发器对应的事件参数类型。
 * @noInheritDoc
 */
@SClass({className: 'EventTrigger', classType: 'EventTrigger'})
export default class EventTrigger<TEvent extends ISeinEvent = ISeinEvent> extends SObject {
  public isEventTrigger = true;
  /**
   * 此触发器是否要在每一次事件触发时立即分发，如果不，怎会先缓存之后在每一帧更新之前统一分发。
   */
  public autoFlush: boolean = true;

  protected _type: SName = null;
  protected _eventManager: EventManager = null;
  protected _paused: boolean = true;
  protected _objHasGame: {getGame(): Game} = null;

  /**
   * 一般不需要自己调用。
   */
  public constructor(
    type: string,
    eventManager: EventManager,
    objHasGame: {getGame(): Game} = null
  ) {
    super();

    this._type = new SName(type);
    this._eventManager = eventManager;
    this._objHasGame = objHasGame;
  }

  /**
   * 该触发器是否已暂停触发。
   */
  get paused() {
    return this._paused;
  }

  /**
   * 获取自身的父级实例引用，一般不需要自己使用。
   */
  get parent() {
    return this._eventManager;
  }

  /**
   * 获取游戏实例引用。
   */
  public getGame(): Game {
    return this._objHasGame.getGame();
  }

  /**
   * 生命周期，触发器开始运作时调用，你可以在这里初始化你的触发器。
   * 比如`window.addEventListener(eventName, this.trigger);`。
   */
  public onBegin() {

  }

  /**
   * 生命周期，触发器停止运作时调用，你可以在这里释放你的触发器。
   */
  public onPause() {

  }

  /**
   * 生命周期，触发器被触发前调用，你可以在这里。
   * 注意别忘了调用`super.onTrigger`来保证默认行为。
   */
  public onTrigger(event: TEvent) {
    this._eventManager.trigger(this._type.value, event, this.autoFlush);
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public trigger = (event: TEvent) => {
    try {
      this.onTrigger(event);
    } catch (error) {
      throwException(error, this);
    }

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public begin() {
    this._paused = false;

    try {
      this.onBegin();
    } catch (error) {
      throwException(error, this);
    }

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public pause() {
    this._paused = true;

    try {
      this.onPause();
    } catch (error) {
      throwException(error, this);
    }

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public destroy() {
    this.pause();
  }
}
