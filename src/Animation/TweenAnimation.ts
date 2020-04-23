/**
 * @File   : TweenAnimation.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/23/2018, 3:08:35 PM
 * @Description:
 */
import Tween from '../Core/Tween';
import Animation, {IAnimationState} from '../Animation/Animation';
import {SClass} from '../Core/Decorator';
import SObject from '../Core/SObject';

/**
 * `TweenAnimation`的初始化参数类型。
 */
export interface ITweenAnimationState extends IAnimationState {
  /**
   * 创建一个`Tween`动画实例。
   * 注意在一次Tween动画播放结束后，务必调用参数中的**onComplete**来通知动画管理器！
   */
  create: (onComplete: () => void) => Tween;
}

/**
 * 判断一个实例是否为`TweenAnimation`。
 */
export function isTweenAnimation(value: SObject): value is TweenAnimation {
  return (value as TweenAnimation).isTweenAnimation;
}

/**
 * 模型动画类，用于存储模型动画。
 * 一般在模型实例化时已经自动生成，不需要自己初始化。
 * 
 * @noInheritDoc
 */
@SClass({className: 'TweenAnimation'})
export default class TweenAnimation extends Animation<ITweenAnimationState> {
  public isTweenAnimation = true;

  protected _tween: Tween;

  /**
   * 获取当前播放时间。
   */
  get currentTime() {
    return this._tween.time;
  }

  /**
   * 获取当前播放总时长。
   */
  get duration() {
    return this._tween.duration;
  }

  /**
   * 获取当前是否处于暂停状态。
   */
  get paused() {
    return this._tween.paused;
  }

  /**
   * @hidden
   */
  public onInit({create}: ITweenAnimationState) {
    this._tween = create(this.handleComplete);
    this._tween.stop();

    this.getGame().event.add('GameWillPause', this.handleElementPause);
    this.getGame().event.add('GameDidResume', this.handleElementResume);
  }

  protected handleElementPause = () => {
    this.pause();
  }

  protected handleElementResume = () => {
    this.resume();
  }

  /**
   * @hidden
   */
  public onPlay(loopCount?: number) {
    this._tween.start();
  }

  /**
   * @hidden
   */
  public onPause() {
    this._tween.pause();
  }

  /**
   * @hidden
   */
  public onResume() {
    this._tween.resume();
  }

  /**
   * @hidden
   */
  public onStop() {
    this._tween.stop();
  }

  protected handleComplete = () => {
    this.handleEnd(this, this.actor);
  }

  /**
   * @hidden
   */
  public onDestroy() {
    this.stop();
    this.getGame().event.remove('GameWillPause', this.handleElementPause);
    this.getGame().event.remove('GameDidResume', this.handleElementResume);
  }
}
