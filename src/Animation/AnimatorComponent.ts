/**
 * @File   : AnimatorComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 7:31:46 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/ISceneActor';
import Component from '../Core/Component';
import Animation, {IAnimationState} from '../Animation/Animation';
import ModelAnimation from '../Animation/ModelAnimation';
import SceneComponent from '../Renderer/SceneComponent';
import Hilo3d from '../Core/Hilo3d';
import SName from '../Core/SName';
import EventManager from '../Event/EventManager';
import FSMComponent from '../AI/FSMComponent';
import SObject from '../Core/SObject';
import Debug from '../Debug';

/**
 * `AnimatorComponent`初始化参数类型。
 */
export interface IAnimatorComponentState {
  componentName?: string;
  current?: string;
}

/**
 * 动画事件的类型接口。
 */
export interface IAnimatorEvent {
  /**
   * 当前动画名称。
   */
  name: string;
  /**
   * 当前动画。
   */
  animation: Animation;
  /**
   * 当前影响的Actor。
   */
  actor: SceneActor;
}

/**
 * 判断一个实例是否为`AnimatorComponent`。
 */
export function isAnimatorComponent(value: SObject): value is AnimatorComponent {
  return (value as AnimatorComponent).isAnimatorComponent;
}

/**
 * 动画组件类，管理着一个Actor下的所有动画。
 * **当挂载到Actor后，你可以直接通过`actor.animator`来访问它。**
 * 
 * @template IParameters 用于指定动画状态机参数的类型。
 * @noInheritDoc
 */
@SClass({className: 'AnimatorComponent'})
export default class AnimatorComponent<IParameters extends {[key: string]: any} = {[key in any]: any}> extends Component<IAnimatorComponentState> {
  public isAnimatorComponent: boolean = true;

  protected _current: string;
  protected _default: string;
  protected _currentAnimation: Animation;
  protected _fsm: FSMComponent = new FSMComponent('fsm');
  protected _loop: number = 0;
  protected _owner: SceneActor;
  protected _event: EventManager<{
    Start: IAnimatorEvent,
    Pause: IAnimatorEvent,
    Resume: IAnimatorEvent,
    Loop: IAnimatorEvent,
    End: IAnimatorEvent
  }>;
  protected _animations: {[name: string]: Animation} = {};
  protected _transitions: {
    [from: string]: {
      conditions: {[to: string]: (params: IParameters) => boolean},
      array: string[],
      length: number
    }
  } = {};
  protected _parameters: IParameters = {} as IParameters;

  /**
   * AnimatorComponent的事件管理器。
   * 
   * ```ts
   * EventManager<{
   *  Start: IAnimatorEvent;
   *  Pause: IAnimatorEvent;
   *  Resume: IAnimatorEvent;
   *  Loop: IAnimatorEvent;
   *  End: IAnimatorEvent;
   * }>
   * ```
   * 
   * [IAnimatorEvent](../interfaces/ianimatorevent)
   */
  get event() {
    return this._event;
  }

  /**
   * 获取当前播放的动画名称。
   */
  get current() {
    return this._current;
  }

  /**
   * 获取状态机实例引用。
   */
  get fsm() {
    return this._fsm;
  }

  /**
   * 获取当前的状态机控制参数引用。
   */
  get parameters() {
    return this._parameters;
  }

  get animationNames() {
    return Object.keys(this._fsm.getState('enter').next);
  }

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit() {
    this._event.register('Start');
    this._event.register('Pause');
    this._event.register('Resume');
    this._event.register('Loop');
    this._event.register('End');

    (this._fsm as any)._parent = this;
    this._fsm.onExit.add(this.handleEnd);
  }

  /**
   * 添加到世界，继承请先`super.onAdd()`。
   */
  public onAdd(initState: IAnimatorComponentState) {
    this.initFromComponent(initState.componentName);

    // fixme: hack for performance
    (this._owner as any)._animator = this;
  }

  /**
   * 修改状态参数的值。
   */
  public setParameter<T extends keyof IParameters>(key: string, value: IParameters[T]) {
    (this._parameters as any)[key] = value;

    return this;
  }

  /**
   * 获取状态参数的值。
   */
  public getParameter<T extends keyof IParameters>(key: string): IParameters[T] {
    return this._parameters[key];
  }

  /**
   * 通过名字获取动画实例引用。
   */
  public getAnimation(name: string): Animation {
    if (!this._animations[name]) {
      Debug.warn(`Animation ${name} is not existed in ${this._owner && this._owner.name}`);
    }

    return this._animations[name];
  }

  /**
   * 通过组件名称添加其下的所有动画。
   */
  public initFromComponent(name: string = 'root') {
    const component: SceneComponent = this._owner.findComponentByName(name);

    if (!component.hiloNode.anim) {
      return;
    }

    const oldPrefix = this._owner.name.value + '@';

    const clips = (component.hiloNode.anim as Hilo3d.Animation).clips;

    Object.keys(clips).forEach(clipName => {
      this.register(clipName.replace(oldPrefix, ''), new ModelAnimation({componentName: name, clipName}));
    });
  }

  /**
   * 每一帧更新，继承请先`super.onUpdate()`。
   */
  public onUpdate(delta: number) {
    this._fsm.update(delta);
  }

  public onUnLink() {
    this.stop();
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    if (this._currentAnimation && !this._currentAnimation.paused) {
      this._currentAnimation.pause();
    }

    if (this._owner.animator === this) {
      (this._owner as any)._animator = null;
    }

    this._fsm.reset();
    this._animations = {};
  }

  protected handleElementEnd = (animation: Animation) => {
    const from = animation.name.value;

    if (!this._transitions[from]) {
      this._fsm.dispatch('exit');

      return;
    }

    const {conditions, length, array} = this._transitions[from];

    for (let index = 0; index < length; index += 1) {
      const to = array[index];
      if (conditions[to](this._parameters)) {
        this._fsm.dispatch(to);
        return;
      }
    }

    this._fsm.dispatch('exit');
  }

  protected handleEnd = () => {
    if (!this._loop || this._loop <= 0) {
      this._event.trigger('End', {name: this.current, animation: this._currentAnimation, actor: this._owner});
      this._currentAnimation = null;
      return;
    }

    this._event.trigger('Loop', {animation: this._currentAnimation, name: this._current, actor: this._owner});
    this._fsm.dispatch(this._current);
    this._loop -= 1;
  }

  /**
   * 注册一个动画为一个名称，通过`isDefault`指定其是否为默认动画。
   */
  public register(name: string, animation: Animation, isDefault: boolean = false) {
    if (isDefault || !this._default) {
      this._default = name;
    }

    animation.name = new SName(name);
    animation.animator = this;
    animation.handleEnd = this.handleElementEnd;
    animation.handlePause = () => this._event.trigger('Pause', {animation, name: this._current, actor: this._owner});
    animation.handleResume = () => this._event.trigger('Resume', {animation, name: this._current, actor: this._owner});

    this._fsm.addState(name, {
      onEnter: () => {
        this._currentAnimation = animation;
        animation.play(this._loop);
      },
      onUpdate: delta => animation.update(delta)
    });
    this.addTransition('enter', name, () => true);
    this._fsm.addTransition('exit', name, 'exit');
    this._animations[name] = animation;

    animation.initialize();

    return this;
  }

  /**
   * 取消注册一个动画。
   */
  public unregister(name: string) {
    this._fsm.removeState(name);
    this._fsm.removeTransition('enter', name);

    if (this._animations[name]) {
      this._animations[name].destroy();
      delete this._animations[name];
    }

    return this;
  }

  /**
   * 设置默认的动画。
   */
  public setDefault(name: string) {
    this._default = name;
  }

  /**
   * 添加一个动画到另一个动画的链接。
   * 
   * @param condition 通过当前状态参数决定此刻是否要执行这个转换，用于当一个动画拥有多个下一步的指向时。
   */
  public addTransition(from: string, to: string, condition?: (params: IParameters) => boolean) {
    this._fsm.addTransition(to, from, to);
    this._transitions[from] = this._transitions[from] || {conditions: {}, array: [], length: 0};
    this._transitions[from].conditions[to] = condition || (() => true);
    this._transitions[from].array.push(to);
    this._transitions[from].length += 1;

    return this;
  }

  /**
   * 修改一个动画到下一个动画的转换判定函数。
   */
  public setTransitionCondition(from: string, to: string, condition: (params: IParameters) => boolean) {
    this._transitions[from].conditions[to] = condition;

    return this;
  }

  /**
   * 移除一个转换。
   */
  public removeTransition(from: string, to: string) {
    this._fsm.removeTransition(from, to);

    if (!this._transitions[from].conditions[to]) {
      return this;
    }

    delete this._transitions[from].conditions[to];
    const index = this._transitions[from].array.indexOf(to);
    this._transitions[from].array.splice(index, 1);
    this._transitions[from].length -= 1;

    return this;
  }

  /**
   * 清空所有动画。
   */
  public clear() {
    this.stop();

    this._fsm = new FSMComponent('fsm');

    return this;
  }

  /**
   * 判定一个动画是否已被注册。
   */
  public has(name: string): boolean {
    return this._fsm.hasTransition('enter', name);
  }

  /**
   * 播放某个动画，不指定`name`将播放默认动画。`loop`用于指定循环次数。
   */
  public play(name?: string, loop?: number) {
    if (!this._fsm.getCurrentState().name.equalsTo('enter')) {
      this.stop();
    }

    name = name || this._default;

    if (!name) {
      return this;
    }

    this._loop = loop || 0;
    this._current = name;

    this._fsm.dispatch(name);
    this._event.trigger('Start', {animation: this._currentAnimation, name: this._current, actor: this._owner});

    return this;
  }

  /**
   * 暂停动画播放。
   */
  public pause() {
    this._currentAnimation.pause();

    return this;
  }

  /**
   * 唤醒动画播放。
   */
  public resume() {
    this._currentAnimation.resume();

    return this;
  }

  /**
   * 停止动画播放。
   */
  public stop() {
    if (this._currentAnimation && !this._currentAnimation.paused) {
      this._currentAnimation.stop();
    }

    this._loop = 0;
    this._fsm.reset();
    this.handleEnd();

    return this;
  }
}
