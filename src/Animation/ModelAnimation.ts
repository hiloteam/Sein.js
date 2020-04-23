/**
 * @File   : ModelAnimation.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/19/2018, 2:25:49 PM
 * @Description:
 */
import Animation, {IAnimationState} from '../Animation/Animation';
import ISceneComponent from '../Renderer/ISceneComponent';
import Hilo3d from '../Core/Hilo3d';
import BreakGuardException from '../Exception/BreakGuardException';
import {SClass} from '../Core/Decorator';
import SObject from '../Core/SObject';

/**
 * `ModelAnimation`的初始化参数类型。
 */
export interface IModelAnimationState extends IAnimationState {
  /**
   * 动画片段名称。
   */
  clipName: string;
  /**
   * 要查询动画的组件名。
   */
  componentName: string;
}

/**
 * 判断一个实例是否为`ModelAnimation`。
 */
export function isModelAnimation(value: SObject): value is ModelAnimation {
  return (value as ModelAnimation).isModelAnimation;
}

/**
 * 模型动画类，用于存储模型动画。
 * 一般在模型实例化时已经自动生成，不需要自己初始化。
 * 
 * @noInheritDoc
 */
@SClass({className: 'ModelAnimation'})
export default class ModelAnimation extends Animation<IModelAnimationState> {
  public isModelAnimation: boolean = true;

  protected _anim: Hilo3d.Animation;
  protected _clipName: string;
  protected _startTime: number = 0;
  protected _endTime: number = 0;
  protected _duration: number = 0;
  protected _currentEndHandler: () => void = () => {};

  /**
   * 获取当前播放总时长。
   */
  get duration() {
    return this._duration;
  }

  /**
   * 获取当前播放时间。
   */
  get currentTime() {
    return this._anim.currentTime;
  }

  /**
   * 获取当前是否处于暂停状态。
   */
  get paused() {
    return this._anim.paused;
  }

  /**
   * @hidden
   */
  public onInit(initState: IModelAnimationState) {
    const component: ISceneComponent = this.actor.findComponentByName(initState.componentName)
      || this.actor.root;

    const animation = component.hiloNode.anim as Hilo3d.Animation;

    if (!animation) {
      throw new BreakGuardException(this, `Model of ${component.name}->${this.actor.name} has no animations !`);
    }

    const clip = animation.clips[initState.clipName];

    if (!clip) {
      throw new BreakGuardException(this, `Clip ${this.className} is not existed in model of ${component.name}->${this.actor.name} !`);
    }

    this._anim = animation;
    this._clipName = initState.clipName;

    this._anim.loop = 0;

    const info = (this._anim as any).getAnimStatesListTimeInfo((clip as any).animStatesList);
    this._duration = info.endTime - info.startTime;
  }

  /**
   * @hidden
   */
  public onPlay(loopCount?: number) {
    // this callback may be re-registered before it was removed, so we must use lambda function to avoid it
    this._currentEndHandler = () => this.handleEnd(this, this.actor);
    this._anim.on('end', this._currentEndHandler, true);
    this._anim.play(this._clipName);
  }

  /**
   * @hidden
   */
  public onPause() {
    this._anim.off('end', this._currentEndHandler);
    this._anim.pause();
  }

  /**
   * @hidden
   */
  public onResume() {
    this._anim.on('end', this._currentEndHandler, true);
    this._anim.resume();
  }

  /**
   * @hidden
   */
  public onStop() {
    this._anim.off('end', this._currentEndHandler);
    this._currentEndHandler = () => {};
    this._anim.stop();
  }

  /**
   * @hidden
   */
  public onUpdate(delta: number) {
    if (!this.paused) {
      this._anim.tick(delta);
    }
  }
}
