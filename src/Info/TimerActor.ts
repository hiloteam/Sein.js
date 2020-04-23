/**
 * @File   : TimerActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 3/21/2019, 4:30:40 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Game from '../Core/Game';
import EventManager from '../Event/EventManager';
import InfoActor from '../Info/InfoActor';
import Actor from '../Core/Actor';

/**
 * 当前Timer的状态。
 */
export interface ITimerState {
  /**
   * 此次倒计时总步数。
   */
  times: number;
  /**
   * 此次每一计时步长。
   */
  timeStep: number;
  /**
   * 当前倒计时步数。
   */
  current: number;
}

/**
 * 判断一个实例是否为`Timer`。
 */
export function isTimerActor(value: Actor): value is TimerActor {
  return (value as TimerActor).isTimerActor;
}

/**
 * 定时器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'Timer', classType: 'Timer'})
export default class TimerActor extends InfoActor {
  public isTimerActor = true;

  protected _game: Game;
  protected _state: ITimerState = {
    times: 0,
    timeStep: 0,
    current: 0
  };
  protected _delta: number = 0;
  protected _paused: boolean = false;
  protected _stopped: boolean = false;

  /**
   * Timer的事件管理器。
   * 
   * ```ts
   * EventManager<{
   *  Start: ITimerState;
   *  Pause: ITimerState;
   *  Resume: ITimerState;
   *  Step: ITimerState;
   *  End: ITimerState;
   * }>
   * ```
   * 
   * [ITimerState](../interfaces/itimerstate)
   */
  get event() {
    return this._root.event as EventManager<{
      Start: ITimerState;
      Pause: ITimerState;
      Resume: ITimerState;
      Step: ITimerState;
      End: ITimerState;
    }>;
  }

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit() {
    this.event.register('Start');
    this.event.register('Pause');
    this.event.register('Resume');
    this.event.register('Step');
    this.event.register('End');
  }

  /**
   * 每帧更新，继承请先`super.onUpdate()`。
   */
  public onUpdate(delta: number) {
    if (this._stopped) {
      this._delta = 0;
      return;
    }

    if (this._delta < this._state.timeStep) {
      this._delta += delta;
      return;
    }

    this._delta = 0;
    if (this._state.current === this._state.times) {
      this.stop();
      return;
    }

    this._state.current += 1;
    this.event.trigger('Step', this._state);
  }

  /**
   * 启动Timer。
   * 
   * @param times 此次倒计时总步数。
   * @param timeStep 此次倒计每次步长。
   */
  public start(times: number, timeStep: number) {
    this._state.times = times;
    this._state.timeStep = timeStep;
    this._state.current = 0;

    this.event.trigger('Start', this._state);

    this._paused = false;
    this._stopped = false;

    return this;
  }

  /**
   * 暂停Timer。
   */
  public pause() {
    if (this._paused || this._stopped) {
      return;
    }

    this._paused = true;
    this.event.trigger('Pause', this._state);

    return this;
  }

  /**
   * 唤醒Timer。
   */
  public resume() {
    if (this._stopped || !this._paused) {
      return;
    }

    this._delta = 0;
    this.event.trigger('Resume', this._state);
    this._paused = false;

    return this;
  }

  /**
   * 停止Timer。
   */
  public stop() {
    this._stopped = true;
    this.event.trigger('End', this._state);

    return this;
  }
}
