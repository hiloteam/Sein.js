/**
 * @File   : FSMComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/9/2018, 11:16:14 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import FSMState, {IFSMStateOptions} from '../AI/FSMState';
import MemberConflictException from '../Exception/MemberConflictException';
import MissingMemberException from '../Exception/MissingMemberException';
import throwException from '../Exception/throwException';
import Observable from '../Core/Observable';
import Component from '../Core/Component';

/**
 * 判断一个实例是否为`FSMComponent`。
 */
export function isFSMComponent(value: SObject): value is FSMComponent {
  return (value as FSMComponent).isFSMComponent;
}

function isArray(value: any): value is any[] {
  return !!(value as any[]).push;
}

/**
 * 有限状态机组件类，一种通用的游戏逻辑编程模型。
 * 默认拥有`enter`和`exit`两个状态。
 * 
 * @noInheritDoc
 */
@SClass({className: 'FSMComponent'})
export default class FSMComponent extends Component {
  public isFSMComponent = true;
  /**
   * 退出一个状态时的回调。
   */
  public onExit: Observable<FSMComponent> = new Observable();
  public _parent: any;

  protected _states: {[name: string]: FSMState} = {};
  protected _current: string = 'enter';
  protected _default: string = null;

  /**
   * @hidden
   */
  constructor(name?: string) {
    super(name, null);

    this.addState('enter');
    this.addState('exit', {onEnter: this.handleExit});
    this.addTransition('reset', 'exit', 'enter');
  }

  /**
   * 获取默认状态名称。
   */
  get defaultState(): string {
    return this._default;
  }

  /**
   * 获取当前状态名称。
   */
  get current(): string {
    return this._current;
  }

  /**
   * 获取当前状态实例引用。
   */
  get currentState(): FSMState {
    return this._states[this._current];
  }

  /**
   * 获取父级实例引用。
   */
  get parent() {
    return this._parent || this._owner;
  }

  /**
   * 获取当前状态实例引用。
   */
  public getCurrentState(): FSMState {
    return this._states[this._current];
  }

  /**
   * 通过名字获取状态实例引用。
   */
  public getState(name: string): FSMState {
    return this._states[name];
  }

  protected handleExit = () => {
    this.dispatch('reset');

    if (this.onExit) {
      this.onExit.parent = this;
      this.onExit.notify(this);
    }
  }

  /**
   * 添加一个实例。
   * 
   * @param isDefault 是否为默认状态
   */
  public addState(name: string, options: IFSMStateOptions = {}, isDefault: boolean = false) {
    if (this._states[name]) {
      throw new MemberConflictException(this, 'State', name, this);
    }

    this._states[name] = new FSMState(name, options, this);

    if (isDefault) {
      this.setDefault(name);
    }

    return this;
  }

  /**
   * 修改默认状态。
   */
  public setDefault(name: string) {
    this._default = name;
    this.addTransition('enter', 'enter', name);

    return this;
  }

  /**
   * 判断是否拥有某个状态。
   */
  public has(name: string) {
    return !!this._states[name];
  }

  /**
   * 移除一个状态。
   */
  public removeState(name: string) {
    const state = this._states[name];
    if (!state) {
      return;
    }

    delete this._states[name];

    return this;
  }

  /**
   * 重置状态机到`enter`状态。
   */
  public reset() {
    this._current = 'enter';

    return this;
  }

  /**
   * 添加一个一对一或一对多的转换。
   */
  public addTransition(action: string, from: string | string[], to: string) {
    const toState = this._states[to];

    if (!toState) {
      throwException(
        new MissingMemberException(this, 'State', to, this),
        this
      );
    }

    if (!isArray(from)) {
      from = [from];
    }

    from.forEach(fromName => {
      const fromState = this._states[fromName];

      if (!fromState) {
        throwException(
          new MissingMemberException(this, 'State', fromName, this),
          this
        );
      }

      if (fromState.next[to]) {
        throwException(
          new MemberConflictException(this, 'State', fromName, this),
          this
        );
      }

      fromState.next[to] = action;
      fromState.actions[action] = to;
    });

    return this;
  }

  /**
   * 移除一个一对一的转换。
   */
  public removeTransition(from: string, to: string): this;
  /**
   * 移除一个多对一的转换。
   */
  public removeTransition(from: string[], to: string): this;
  /**
   * 移除一个一对多的转换。
   */
  public removeTransition(from: string, to: string[]): this;
  public removeTransition(from: string | string[], to: string | string[]): this {
    if (!isArray(from) && !isArray(to)) {
      this.removeOneTransition(from, to);
    }

    if (isArray(from) && !isArray(to)) {
      from.forEach(name => this.removeOneTransition(name, to));
    }

    if (isArray(to) && !isArray(from)) {
      to.forEach(name => this.removeOneTransition(from, name));
    }

    return this;
  }

  protected removeOneTransition(from: string, to: string) {
    const fromState = this._states[from];

    if (!fromState || !fromState.next[to]) {
      return;
    }

    const action = fromState.next[to];
    delete fromState.next[to];
    delete fromState.actions[action];

    return this;
  }

  /**
   * 添加多对转换。
   */
  public addTransitions(options: {action: string, from: string | string[], to: string}[]) {
    options.forEach(option => this.addTransition(option.action, option.from, option.to));

    return this;
  }

  /**
   * 移除多对转换。
   */
  public removeTransitions(options: ({from: string[], to: string} | {from: string, to: string[]})[]) {
    options.forEach(option => (this.removeTransition as any)(option.from, option.to));

    return this;
  }

  /**
   * 判断是否拥有某对转换。
   */
  public hasTransition(from: string, action: string) {
    const state = this._states[from];

    if (!state) {
      return false;
    }

    return !!state.actions[action];
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public enter() {
    this.dispatch('enter');
  }

  /**
   * 每一帧更新，继承请先`super.onUpdate()`。
   */
  public onUpdate(delta: number) {
    if (!this._current) {
      return;
    }

    const state = this._states[this._current];

    if (state) {
      state.update(delta);
    }
  }

  /**
   * 执行某个动作`action`，触发转换。
   */
  public dispatch(action: string) {
    if (!this._current || !this._states[this._current]) {
      throwException(
        new Error(`State "${this._current}" does not in this fsm now: "${this.name}"!`),
        this
      );
    }

    const currentState = this._states[this._current];
    currentState.exit();

    const nextName = currentState.actions[action];

    if (!nextName || !this._states[nextName]) {
      throwException(
        new Error(`FromState "${this._current}" does not have action "${action}"!`),
        this
      );
    }

    this._current = nextName;
    this._states[nextName].enter();

    return this;
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    this.reset();
  }
}
