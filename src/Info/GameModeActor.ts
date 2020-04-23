/**
 * @File   : GameModeActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/29 上午11:49:15
 * @Description:
 */
import World from '../Core/World';
import {SClass} from '../Core/Decorator';
import InfoActor from '../Info/InfoActor';
import StateActor from '../Info/StateActor';
import {TConstructor} from '../types/Common';
import Game from '../Core/Game';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`GameModeActor`。
 */
export function isGameModeActor(value: SObject): value is GameModeActor {
  return (value as GameModeActor).isGameModeActor;
}

/**
 * 游戏玩法逻辑Actor类。此类承载着一个`World`的整体玩法逻辑，适用于其下的所有`Level`。
 * 
 * @template IWorldState 世界状态参数类型。
 * 
 * @noInheritDoc
 */
@SClass({className: 'GameModeActor'})
export default class GameModeActor<IWorldState extends StateActor = StateActor> extends InfoActor {
  /**
   * 指定一个状态类，在此类所从属的`World`实例化时，会由其生成默认的`WorldState`实例。
   */
  public static WorldStateClass: TConstructor<StateActor> = StateActor;

  public isGameModeActor: boolean = true;
  public readonly updatePriority = InfoActor.UPDATE_PRIORITY.GameMode;

  /**
   * 此实例的父级实际指向`Game`。
   */
  get parent(): Game {
    return this._game;
  }

  /**
   * 获取当前`World`的状态。
   */
  get state() {
    return this.getWorld<IWorldState>().state;
  }

  /**
   * 一个特殊的生命周期，在`onAdd`之后触发，只有在此生命周期内，你可以**执行阻塞的异步逻辑**。
   * 这个生命周期一般用于用户登录、获取异步状态等逻辑，谨慎使用！
   */
  public async onLogin() {

  }

  /**
   * 生命周期，在`onLogin`之后触发。
   * 用于创建游戏玩家`Player`，默认会创建一个名为`'player'`的玩家。
   */
  public onCreatePlayers() {
    this._game.createPlayer('player', null, true);
  }

  /**
   * 生命周期，在`onDestroy`之后触发。
   * 用于销毁玩家，默认不执行销毁，即保留玩家。
   */
  public onDestroyPlayers() {

  }
}
