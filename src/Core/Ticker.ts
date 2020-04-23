/**
 * @File   : Ticker.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:23:42
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import Debug from '../Debug';

/**
 * 判断一个实例是否为`Ticker`。
 */
export function isTicker(value: SObject): value is Ticker {
  return (value as Ticker).isTicker;
}

/**
 * 维护一个监听器队列，在每一帧调用队列里的回调。
 * 
 * @noInheritDoc
 */
@SClass({className: 'Ticker', classType: 'Ticker'})
export default class Ticker extends SObject {
  public isTicker: boolean = true;

  private _rafId: number = 0;
  private _lockFrame: boolean = false;
  private _fps: number = 0;
  private _spf: number = 0;
  private _pre: number = 0;
  private _delta: number = 0;
  private _actualPre: number = 0;
  private _tickers: ((delta: number) => void)[] = [];
  private _tickersQueue: ((delta: number) => void)[] = [];
  private _needUpdate: boolean = false;
  private _paused: boolean = true;

  /**
   * 指定锁定帧率，创建一个Ticker。
   * 若不指定则不锁帧。
   */
  constructor(fps?: number) {
    super('SeinTimer');

    if (fps !== undefined && fps !== null) {
      this.fps = fps;
    }
  }

  /**
   * 修改锁定帧率。
   */
  set fps(fps: number) {
    if (60 % fps !== 0) {
      Debug.warn(`${fps}fps is not safe, you can only choice 60, 30, 20(not in low-power mode in safari), 15, 10 or 5 !`);
    }

    this._fps = fps;
    this._spf = 1000 / fps;
    this._lockFrame = true;
  }

  /**
   * 获取锁定帧率。
   */
  get fps(): number {
    return this._fps;
  }

  /**
   * Ticker是否暂停。
   */
  get paused() {
    return this._paused;
  }

  /**
   * 设置是否开启锁帧。
   */
  set lockFrame(value: boolean) {
    this._lockFrame = value;
  }

  /**
   * 获取是否开启锁帧。
   */
  get lockFrame() {
    return this._lockFrame;
  }

  /**
   * 添加一个ticker监听器到队列中。
   */
  public add(listener: (delta: number) => void) {
    this._tickers.push(listener);
    this._needUpdate = true;

    return this;
  }

  /**
   * 从队列中移除一个监听器。
   */
  public remove(listener: (delta: number) => void) {
    this._tickers.splice(this._tickers.indexOf(listener), 1);
    this._needUpdate = true;

    return this;
  }

  /**
   * 启动Ticker。
   */
  public start() {
    this._paused = false;
    this._pre = 0;
    this._delta = 0;
    this._actualPre = 0;

    this.raf(this.update);

    return this;
  }

  /**
   * 暂停Ticker。
   */
  public pause() {
    this._paused = true;
    this._rafId += 1;

    return this;
  }

  private raf(callback: (ts: number, rafId: number) => void) {
    if (this._rafId >= 65535) {
      this._rafId = 0;
    } else {
      this._rafId += 1;
    }
    const rafId = this._rafId;
    
    requestAnimationFrame((ts: number) => callback(ts, rafId));
  }

  protected update = (ts: number, rafId: number) => {
    if (this._paused || this._rafId !== rafId) {
      return;
    }

    this.raf(this.update);

    if (this._pre === 0) {
      this._pre = ts;
      this._actualPre = Date.now();

      return;
    }

    if (this._needUpdate) {
      this._tickersQueue = this._tickers.slice();
      this._needUpdate = false;
    }

    const delta = ts - this._pre;
    this._pre = ts;

    if (!this._lockFrame) {
      const length = this._tickersQueue.length;

      for (let i = 0; i < length; i += 1) {
        this._tickersQueue[i](delta);
      }

      return;
    }

    if (this._delta >= this._spf) {
      const now = Date.now();
      const actualDelta = now - this._actualPre;
      this._actualPre = now;
      this._delta -= this._spf * ~~(this._delta / this._spf);

      const length = this._tickersQueue.length;
      for (let i = 0; i < length; i += 1) {
        this._tickersQueue[i](actualDelta);
      }
    }

    this._delta += delta;
  }
}
