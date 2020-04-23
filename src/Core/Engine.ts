/**
 * @File   : Engine.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:22:52
 * @Description:
 */
import SObject from '../Core/SObject';
import Game from '../Core/Game';
import Ticker from '../Core/Ticker';
import {SClass} from '../Core/Decorator';
import BaseException from '../Exception/BaseException';
import throwException from '../Exception/throwException';
import Tween from '../Core/Tween';
import Debug from '../Debug';
import StateActor from '../Info/StateActor';

/**
 * 判断一个实例是否为`Engine`。
 */
export function isEngine(value: SObject): value is Engine {
  return (value as Engine).isEngine;
}

/**
 * Engine的初始化参数。
 */
export interface IEngineOptions {
  /**
   * 引擎全局帧率，用于锁帧，不传则不锁帧。
   */
  fps?: number;
}

/**
 * 顶层引擎类，一般除了初始化游戏不需要直接控制。
 * 
 * @noInheritDoc
 */
@SClass({className: 'Engine', classType: 'Engine'})
export default class Engine extends SObject {
  /**
   * 当前所有正在运行的Engine，一般情况下只有一个。
   */
  private static RUNNING_ENGINES: Engine[] = [];
  /**
   * 获取当前运行的Engine实例。
   * 
   * @param index 索引，不传则取回第一个，一般也就是唯一的一个。
   */
  public static GET_RUNNING_ENGINE(index: number = 0): Engine {
    return Engine.RUNNING_ENGINES[index];
  }

  public isEngine: boolean = true;

  private _options: IEngineOptions = null;
  private _ticker: Ticker = null;
  private _games: Game[] = [];
  private _runningGames: Game[] = [];

  constructor(options?: IEngineOptions) {
    super('SeinEngine');
    Engine.RUNNING_ENGINES.push(this);

    this._options = options || {};

    this._ticker = new Ticker(this._options.fps);
    this._ticker.add(this.update);
  }

  /**
   * 当前参数。
   */
  get options() {
    return this._options;
  }

  /**
   * 全局Ticker。
   */
  get ticker(): Ticker {
    return this._ticker;
  }

  /**
   * 当前运行环境，一般为`development`或`production`。
   */
  get env() {
    return Debug.env;
  }

  /**
   * `env`不为`production`时，判定为开发环境。
   */
  get devMode() {
    return Debug.devMode;
  }

  /**
   * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError(error: BaseException, details?: any): boolean | void {
    Debug.warn(`Error '${error.message}' reaches engine, try to catch it in exception chain !`);
  }

  /**
   * 添加一个游戏实例到引擎中。
   */
  public addGame(game: Game) {
    (game as any)._engine = this;
    this._games.push(game);

    try {
      game.onAdd();
    } catch (error) {
      throwException(error, game);
    }

    return this;
  }

  /**
   * 将一个游戏实例从引擎中移除。
   */
  public removeGame(game: Game) {
    let index = this._runningGames.indexOf(game);

    if (index >= 0) {
      this.destroyGame(game);
    }

    index = this._games.indexOf(game);

    if (index >= 0) {
      this._games.splice(index, 1);
    }

    (game as any)._engine = null;

    return this;
  }

  /**
   * 获取当前运行的某个Game实例。
   * 
   * @param index 索引，不传则取回第一个，一般也就是唯一的一个。
   */
  public getRunningGame(index: number = 0) {
    return this._runningGames[index];
  }

  /**
   * 不要自己调用！
   * 
   * @hidden
   */
  public startGame(game: Game) {
    if (this._runningGames.indexOf(game) < 0) {
      this._runningGames.push(game);

      try {
        game.onStart();
      } catch (error) {
        throwException(error, game);
      }
    }

    if (this._ticker.paused) {
      this._ticker.start();
    }

    return this;
  }

  /**
   * 不要自己调用！
   * 
   * @hidden
   */
  public pauseGame(game: Game) {
    try {
      game.onPause();
    } catch (error) {
      throwException(error, game);
    }

    this._runningGames.splice(this._runningGames.indexOf(game), 1);

    if (this._runningGames.length === 0) {
      this._ticker.pause();
    }

    return this;
  }

  /**
   * 不要自己调用！
   * 
   * @hidden
   */
  public resumeGame(game: Game) {
    this._runningGames.push(game);

    try {
      game.onResume();
    } catch (error) {
      throwException(error, game);
    }

    if (this._ticker.paused) {
      this._ticker.start();
    }

    return this;
  }

  /**
   * 不要自己调用！
   * 
   * @hidden
   */
  public restartGame(game: Game) {
    this.destroyGame(game);
    this.startGame(game);

    return this;
  }

  /**
   * @hidden
   */
  public destroyGame(game: Game) {
    const index = this._runningGames.indexOf(game);

    if (index >= 0) {
      this._runningGames.splice(index, 1);

      try {
        game.onDestroy();
      } catch (error) {
        throwException(error, game);
      }
    }

    if (this._runningGames.length === 0) {
      this._ticker.pause();
    }

    this.removeGame(game);

    return this;
  }

  /**
   * 启动所有游戏，一般使用`game.start()`作为替代，启动特定游戏。
   */
  public start() {
    this._games.forEach(game => game.start());

    return this;
  }

  /**
   * 暂停所有游戏，一般使用`game.pause()`作为替代，暂停特定游戏。
   */
  public pause() {
    this._runningGames.forEach(game => game.pause());

    return this;
  }

  /**
   * 唤醒所有游戏，一般使用`game.resume()`作为替代，唤醒特定游戏。
   */
  public resume() {
    this._games.forEach(game => game.resume());

    return this;
  }

  /**
   * 销毁所有游戏，一般使用`game.destroy()`作为替代，销毁特定游戏。
   */
  public destroy() {
    this._runningGames.forEach(game => game.destroy());
    this._games = [];
    Engine.RUNNING_ENGINES.splice(Engine.RUNNING_ENGINES.indexOf(this), 1);
  }

  private update = (delta: number) => {
    const length = this._runningGames.length;

    Tween.tick();

    for (let i = 0; i < length; i += 1) {
      this._runningGames[i].update(delta);
    }
  }
}
