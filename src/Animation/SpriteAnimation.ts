/**
 * @File   : SpriteAnimation.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 5:25:59 PM
 * @Description:
 */
import Animation, {IAnimationState} from '../Animation/Animation';
import Texture from '../Texture/Texture';
import SpriteComponent from '../Renderer/SpriteComponent';
import TypeConflictException from '../Exception/TypeConflictException';
import {SClass} from '../Core/Decorator';
import SObject from '../Core/SObject';
import AtlasManager from '../Texture/AtlasManager';

/**
 * 基于图集的精灵动画的初始化参数类型。
 */
export interface ISpriteAnimationState extends IAnimationState {
  /**
   * 要控制播放的组件名，默认为根组件。
   */
  componentName?: string;
  /**
   * 播放帧率，默认取游戏帧率。
   */
  fps?: number;
  /**
   * 图集。若不指定则去找组件自身的，若还没有则会出错。
   */
  atlas?: AtlasManager;
  /**
   * 要播放的帧数。
   * 
   * @default 所有帧
   */
  frameNames?: string[];
}

/**
 * 判断一个实例是否为`SpriteAnimation`。
 */
export function isSpriteAnimation(value: SObject): value is SpriteAnimation {
  return (value as SpriteAnimation).isSpriteAnimation;
}

/**
 * 2D精灵动画类，用于管理2D精灵动画的播放。根据初始化参数的不同，拥有两种模式。
 * 一种是基于帧序列的，指定单元尺寸和空隙以及帧数队列来进行播放。
 * 另一种是基于图集Atlas的，指定帧名队列来进行播放。
 * 
 * 
 * @noInheritDoc
 */
@SClass({className: 'SpriteAnimation'})
export default class SpriteAnimation extends Animation<ISpriteAnimationState> {
  public isSpriteAnimation: boolean = true;

  protected _type: 'Atlas' | 'Texture';
  protected _component: SpriteComponent;
  protected _atlas: AtlasManager;
  protected _frames: string[];
  protected _fps: number;
  protected _current: number;
  protected _paused: boolean = true;
  protected _length: number;
  protected _delta: number = 0;

  /**
   * 获取当前播放总时长。
   */
  get duration() {
    return this._length * 1000 / (this._fps || this.parent.getGame().fps);
  }

  /**
   * 获取当前播放总帧数。
   */
  get frameCount() {
    return this._length;
  }

  /**
   * 获取当前播放帧。
   */
  get currentFrame() {
    return this._current;
  }

  /**
   * 获取当前播放时间。
   */
  get currentTime() {
    return this._current * 1000 / (this._fps || this.parent.getGame().fps);
  }

  /**
   * @hidden
   */
  public onInit(initState: ISpriteAnimationState) {
    const component = this._component = this.actor.findComponentByName<SpriteComponent>(initState.componentName || 'root');

    if (!component.isSpriteComponent) {
      throw new TypeConflictException(component, 'SpriteComponent', this);
    }

    this._fps = initState.fps;

    const atlas = this._atlas = initState.atlas || component.atlas;

    this._frames = initState.frameNames;

    if (!initState.frameNames) {
      this._frames = Object.keys(atlas.frames);
    }

    this._length = this._frames.length;
  }

  protected handleElementEnd = () => {
    this.handleEnd(this, this.actor);
  }

  /**
   * @hidden
   */
  public onPlay(loopCount?: number) {
    this._current = 0;
    this._delta = 0;
    this._paused = false;
    this._component.atlas = this._atlas;
  }

  /**
   * @hidden
   */
  public onPause() {
    this._paused = true;
  }

  /**
   * @hidden
   */
  public onResume() {
    this._paused = false;
    this._delta = 0;
    this._component.atlas = this._atlas;
  }

  /**
   * @hidden
   */
  public onStop() {
    this._current = 0;
    this._paused = true;
  }

  /**
   * @hidden
   */
  public onUpdate(delta: number) {
    if (this._paused) {
      return;
    }

    const fps = this._fps || this.parent.getGame().fps;
    if (this._delta < 1000 / fps) {
      this._delta += delta;
      return;
    } else {
      this._delta = 0;
    }

    this._component.setFrame(this._frames[this._current]);
    this._current += 1;

    if (this._current === this._length) {
      this.stop();

      this.handleElementEnd();
    }
  }
}
