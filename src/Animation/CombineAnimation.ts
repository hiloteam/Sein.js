/**
 * @File   : CombineAnimation.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/28/2018, 9:33:48 PM
 * @Description:
 */
import Animation, {IAnimationState} from '../Animation/Animation';
import {SClass} from '../Core/Decorator';
import SObject from '../Core/SObject';

/**
 * `CombineAnimation`的初始化参数类型。
 */
export interface ICombineAnimationState extends IAnimationState {
  /**
   * 要组合的动画实例数组。
   */
  animations: Animation[];
}

/**
 * 判断一个实例是否为`CombineAnimation`。
 */
export function isCombineAnimation(value: SObject): value is CombineAnimation {
  return (value as CombineAnimation).isCombineAnimation;
}

/**
 * 组合动画类，可以并行播放多个动画，结束以最后一个结束的为准。
 * 
 * @noInheritDoc
 */
@SClass({className: 'CombineAnimation'})
export default class CombineAnimation extends Animation<ICombineAnimationState> {
  public isCombineAnimation = true;

  protected _animations: Animation[];
  protected _count: number = 0;
  protected _length: number = 0;

  /**
   * @hidden
   */
  public onInit(options: ICombineAnimationState) {
    this._animations = options.animations;
    this._length = this._animations.length;

    for (let index = 0; index < this._length; index += 1) {
      const animation = this._animations[index];
      animation.handleEnd = this.handleElementEnd;
      animation.animator = this.animator;
      animation.initialize();
    }
  }

  protected handleElementEnd = () => {
    this._count += 1;

    if (this._count === this._length) {
      this.handleEnd(this, this.actor);
    }
  }

  /**
   * @hidden
   */
  public onPlay(loopCount?: number) {
    this._count = 0;
    for (let index = 0; index < this._length; index += 1) {
      this._animations[index].play(loopCount);
    }
  }

  /**
   * @hidden
   */
  public onPause() {
    for (let index = 0; index < this._length; index += 1) {
      this._animations[index].pause();
    }
  }

  /**
   * @hidden
   */
  public onResume() {
    for (let index = 0; index < this._length; index += 1) {
      this._animations[index].resume();
    }
  }

  /**
   * @hidden
   */
  public onStop() {
    for (let index = 0; index < this._length; index += 1) {
      this._animations[index].stop();
    }
  }

  /**
   * @hidden
   */
  public onUpdate(delta: number) {
    for (let index = 0; index < this._length; index += 1) {
      this._animations[index].onUpdate(delta);
    }
  }

  /**
   * @hidden
   */
  public onDestroy() {
    for (let index = 0; index < this._length; index += 1) {
      this._animations[index].destroy();
    }
  }
 }
