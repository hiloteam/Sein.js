/**
 * @File   : Player.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 上午11:31:03
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import PlayerControllerActor from '../Player/PlayerControllerActor';
import PlayerStateActor from '../Player/PlayerStateActor';
import BreakGuardException from '../Exception/BreakGuardException';
import Game from '../Core/Game';
import throwException from '../Exception/throwException';
import StateActor from '../Info/StateActor';
import World from '../Core/World';
import Level from '../Core/Level';
import {IPhysicWorld} from '../types/Physic';
import BaseException from '../Exception/BaseException';
import SceneActor from '../Renderer/SceneActor';
import SceneComponent, {ISceneComponentState} from '../Renderer/SceneComponent';

/**
 * 判断一个实例是否为`Player`。
 */
export function isPlayer(value: SObject): value is Player {
  return (value as Player).isPlayer;
}

/**
 * 玩家类，用于管理玩家的逻辑。
 * 一般不直接用于控制实例，而是使用其在`World`中的代理`PlayerControllerActor`。
 * 可以对齐进行继承扩展，来达到一种自顶向下的设计理念，详见[Player](../../guide/player)。
 * 
 * @noInheritDoc
 */
@SClass({className: 'Player'})
export default class Player extends SObject {
  public isPlayer = true;

  protected _controller: PlayerControllerActor;
  protected _game: Game;

  constructor(name: string, game: Game) {
    super(name);

    this._game = game;
  }

  /**
   * 父级为Game。
   */
  get parent() {
    return this._game;
  }

  /**
   * 直接获取无类型的控制器实例引用，建议使用`getController`替代。
   */
  get controller() {
    return this._controller;
  }

  /**
   * 直接获取无类型的状态实例引用，建议使用`getState`替代。
   */
  get state() {
    return this._controller.state;
  }

  /**
   * 生命周期，在实例创建后触发。
   */
  public onInit() {

  }

  /**
   * 生命周期，在实例获取到控制器的所有权时触发。
   */
  public onSwitchController(controller: PlayerControllerActor) {

  }

  /**
   * 生命周期，在实例释放控制器的所有权时触发。
   */
  public onReleaseController(controller: PlayerControllerActor) {

  }

  /**
   * 生命周期，在每一帧更新时触发。
   */
  public onUpdate(delta: number) {

  }

  /**
   * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError(error: BaseException, details?: any): boolean | void {

  }

  /**
   * 切换自身在World中代理的Controller。
   */
  public switchController(controller: PlayerControllerActor) {
    if (controller.player) {
      throw new BreakGuardException(this, `Controller ${controller.name} already owned by player ${controller.parent.name} !`);
    }

    this._controller = controller;
    (controller as any)._player = this;

    try {
      this.onSwitchController(controller);
    } catch (error) {
      throwException(error, this);
    }

    return this;
  }

  /**
   * 释放当前自身在World中代理的Controller。
   */
  public releaseController() {
    try {
      this.onReleaseController(this._controller);
    } catch (error) {
      throwException(error, this);
    }

    if (this._controller) {
      (this._controller as any)._player = null;
    }
    this._controller = null;

    return this;
  }

  /**
   * 获取当前自身在World中代理的Controller。
   */
  public getController<TController extends PlayerControllerActor = PlayerControllerActor>(): TController {
    return this._controller as TController;
  }

  /**
   * 获取当前自身在World中代理的Controller的状态。
   */
  public getState<TState extends PlayerStateActor = PlayerStateActor>(): TState {
    return this._controller.getState<TState>();
  }

  /**
   * 获取当前`Game`实例。
   * 
   * @template IGameState 当前游戏状态管理器的类型。
   */
  public getGame<IGameState extends StateActor = StateActor>(): Game<IGameState> {
    return this._game as Game<IGameState>;
  }

  /**
   * 获取当前`World`实例。
   * 
   * @template IWorldState 当前世界状态管理器的类型。
   */
  public getWorld<IWorldState extends StateActor = StateActor>(): World<IWorldState> {
    return this._game.world as World<IWorldState>;
  }

  /**
   * 获取当前`Level`实例。
   * 
   * @template ILevelState 当前关卡状态管理器的类型。
   */
  public getLevel<ILevelState extends StateActor = StateActor>(): Level<ILevelState> {
    return this._game.level as Level<ILevelState>;
  }

  /**
   * 仅在初始化了物理引擎之后，用于获取当前物理世界`PhysicWorld`实例。
   * 如何使用物理引擎请见**Guide**和**Demo**。
   */
  public getPhysicWorld(): IPhysicWorld {
    return this._game.world.physicWorld;
  }

  /**
   * **不要自行调用！**
   *
   * @hidden
   */
  public update(delta: number) {
    try {
      this.onUpdate(delta);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自行调用！**
   *
   * @hidden
   */
  public destroy() {
    if (this._controller) {
      (this._controller as any)._player = null;
    }
    this._controller = null;
    this._game = null;

    super.destroy();
  }
}
