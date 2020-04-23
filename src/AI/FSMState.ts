/**
 * @File   : FSMState.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/26/2018, 2:56:37 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import FSMComponent from '../AI/FSMComponent';

/**
 * `FSMState`初始化参数类型。
 */
export interface IFSMStateOptions {
  /**
   * 进入状态时触发的回调。
   */
  onEnter?(state: FSMState);
  /**
   * 每一帧更新时触发的回调。
   */
  onUpdate?(delta: number, state: FSMState);
  /**
   * 退出状态时触发的回调。
   */
  onExit?(state: FSMState);
}

/**
 * 判断一个实例是否为`FSMState`。
 */
export function isFSMState(value: SObject): value is FSMState {
  return (value as FSMState).isFSMState;
}

/**
 * 状态机的状态类，用于存储状态以及行为。
 * 
 * @noInheritDoc
 */
@SClass({className: 'FSMState', classType: 'FSMState'})
export default class FSMState extends SObject {
  public isFSMState = true;

  /**
   * action到下一个state的对应表。
   */
  public actions: {[action: string]: string};
  /**
   * 下一个state到action的对应表。
   */
  public next: {[name: string]: string};
  /**
   * 进入状态时触发的回调。
   */
  public onEnter: (state: FSMState) => void;
  /**
   * 每一帧更新时触发的回调。
   */
  public onUpdate: (delta: number, state: FSMState) => void;
  /**
   * 退出状态时触发的回调。
   */
  public onExit: (state: FSMState) => void;

  protected _fsm: FSMComponent;

  constructor(name: string, options: IFSMStateOptions, parent: FSMComponent) {
    super(name);

    this._fsm = parent;
    this.onEnter = options.onEnter;
    this.onUpdate = options.onUpdate;
    this.onExit = options.onExit;
    this.actions = {};
    this.next = {};
  }

  /**
   * 获取父级状态机。
   */
  get fsm() {
    return this._fsm;
  }

  /**
   * 进入此状态，将会触发对应回调。
   */
  public enter() {
    if (this.onEnter) {
      this.onEnter(this);
    }
  }

  /**
   * 每一帧更新，将会触发对应回调。
   */
  public update(delta: number) {
    if (this.onUpdate) {
      this.onUpdate(delta, this);
    }
  }

  /**
   * 退出此状态，将会触发对应回调。
   */
  public exit() {
    if (this.onExit) {
      this.onExit(this);
    }
  }
}
