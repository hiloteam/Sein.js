/**
 * @File   : Animation.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/19/2018, 10:51:16 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import SceneActor from '../Renderer/ISceneActor';
import {SClass} from '../Core/Decorator';
import throwException from '../Exception/throwException';
import BaseException from '../Exception/BaseException';
import AnimatorComponent from '../Animation/AnimatorComponent';
import FSMComponent from '../AI/FSMComponent';
import StateActor from '../Info/StateActor';
import Game from '../Core/Game';
import World from '../Core/World';
import Level from '../Core/Level';

/**
 * `Animation`的初始化参数类型。
 */
export interface IAnimationState {
  /**
   * 播放速度，具体交由每个动画自行实现。
   */
  speed?: number;
}

/**
 * 判断一个实例是否为`Animation`。
 */
export function isAnimation(value: SObject): value is Animation {
  return (value as Animation).isAnimation;
}

/**
 * @hidden
 */
function nop() {}

/**
 * 动画基类，作为动画组件的组成基本单元。
 * 一般不直接使用，而是使用各个派生类。
 * 
 * @noInheritDoc
 */
@SClass({className: 'Animation', classType: 'Animation'})
export default class Animation<IStateTypes extends IAnimationState = IAnimationState> extends SObject {
  public isAnimation: boolean = true;
  public animator: AnimatorComponent = null;
  /**
   * 播放速度，具体交由每个动画自行实现。
   */
  public speed: number = 1;
  /**
   * 播放开始时的回调，一般不需要自己使用。
   */
  public handleStart: (animation: Animation, actor: SceneActor) => any = nop;
  /**
   * 播放结束后的回调，**作为终止行为，请在动画结束时自行调用！**。
   */
  public handleEnd: (animation: Animation, actor: SceneActor) => any = nop;
  /**
   * 播放暂停时的回调，一般不需要自己使用。。
   */
  public handlePause: (animation: Animation, actor: SceneActor) => any = nop;
  /**
   * 播放唤醒时的回调，一般不需要自己使用。。
   */
  public handleResume: (animation: Animation, actor: SceneActor) => any = nop;

  protected _initState: IStateTypes = null;
  protected _paused: boolean = true;

  constructor(initState: IStateTypes) {
    super();

    initState.speed = initState.speed || 1;
    this.speed = initState.speed;
    this._initState = initState;
  }

  /**
   * 获取自身的父级动画组件实例引用，一般不需要自己使用。
   */
  get parent(): AnimatorComponent {
    return this.animator;
  }

  /**
   * 获取自身的父级动画组件的Onwer实例引用。
   */
  get actor(): SceneActor {
    return this.animator.getOwner() as SceneActor;
  }

  /**
   * 获取自身动画组件的状态机实例引用。
   */
  get fsm(): FSMComponent {
    return this.animator.fsm;
  }

  /**
   * 获取当前播放时间。
   */
  get currentTime(): number {
    throw new Error('Not implemented !');
  }

  /**
   * 获取当前播放总时长。
   */
  get duration(): number {
    throw new Error('Not implemented !');
  }

  /**
   * 获取当前是否处于暂停状态。
   */
  get paused() {
    return this._paused;
  }

  /**
   * 获取当前`Game`实例。
   * 
   * @template IGameState 当前游戏状态管理器的类型。
   */
  public getGame<IGameState extends StateActor = StateActor>(): Game<IGameState> {
    return this.actor.getGame<IGameState>();
  }

  /**
   * 获取当前`World`实例。
   * 
   * @template IWorldState 当前世界状态管理器的类型。
   */
  public getWorld<IWorldState extends StateActor = StateActor>(): World<IWorldState> {
    return this.actor.getWorld<IWorldState>();
  }

  /**
   * 获取当前`Level`实例。
   * 
   * @template ILevelState 当前关卡状态管理器的类型。
   */
  public getLevel<ILevelState extends StateActor = StateActor>(): Level<ILevelState> {
    return this.actor.getLevel<ILevelState>();
  }

  /**
   * 生命周期，将在初始化时触发，你可以重写此方法来实现自定义动画。
   */
  public onInit(initState: IStateTypes) {

  }

  /**
   * 生命周期，将在`play`时触发，你可以重写此方法来实现自定义动画。
   * 
   * @param loopCount 当前循环次数
   */
  public onPlay(loopCount?: number) {

  }

  /**
   * 生命周期，将在`pause`时触发，你可以重写此方法来实现自定义动画。
   */
  public onPause() {

  }

  /**
   * 生命周期，将在`resume`时触发，你可以重写此方法来实现自定义动画。
   */
  public onResume() {

  }

  /**
   * 生命周期，将在`stop`时触发，你可以重写此方法来实现自定义动画。
   */
  public onStop() {

  }

  /**
   * 生命周期，将在每一帧`update`时触发，你可以重写此方法来实现自定义动画。
   */
  public onUpdate(delta: number) {

  }

  /**
   * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError(error: BaseException, details: any) {

  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public initialize() {
    try {
      this.onInit(this._initState);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public play(loopCount?: number) {
    this._paused = false;

    try {
      this.onPlay(loopCount);
      this.handleStart(this, this.actor);
    } catch (error) {
      throwException(error, this);
    }
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
      this.handlePause(this, this.actor);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public resume() {
    this._paused = false;

    try {
      this.onResume();
      this.handleResume(this, this.actor);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public stop() {
    this._paused = true;

    try {
      this.onStop();
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
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
}
