/**
 * @File   : JointComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/22/2018, 7:28:06 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Component from '../Core/Component';
import {EJointType, IJointCommonOptions, TJointParams} from '../types/Physic';
import SceneActor from '../Renderer/ISceneActor';
import BreakGuardException from '../Exception/BreakGuardException';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`JointComponent`。
 */
export function isJointComponent(value: SObject): value is JointComponent {
  return (value as JointComponent).isJointComponent;
}

/**
 * 铰链组件基类。一般不自己使用，而是交由继承的类实现多态。
 * 
 * @template IStateTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * @noInheritDoc
 */
@SClass({className: 'JointComponent'})
export default class JointComponent<IStateTypes extends IJointCommonOptions = IJointCommonOptions> extends Component<IStateTypes> {
  public isJointComponent = true;

  protected _type: EJointType = EJointType.PointToPoint;
  protected _owner: SceneActor;
  protected _joint: {component: JointComponent, [key: string]: any};

  /**
   * 获取物理世界的铰链，不要自己操作。
   * 
   * @hidden
   */
  get joint() {
    return this._joint;
  }

  /**
   * 获取铰链类型。
   */
  get type() {
    return this._type;
  }

  /**
   * 获取初始化参数实例引用。
   */
  get initState(): IStateTypes {
    return this._initState;
  }

  /**
   * 开发环境下，验证可添加性。
   */
  public verifyAdding(initState: IStateTypes) {
    const {rigidBody} = this._owner;

    if (!rigidBody || !initState.actor.rigidBody) {
      throw new BreakGuardException(this, 'RigidBodyComponent must be added to self or other actor before adding JointComponent !');
    }
  }

  /**
   * 添加到世界，继承请先`super.onAdd()`。
   */
  public onAdd(initState: IStateTypes) {
    const {rigidBody} = this._owner;
    const options: IStateTypes = this._initState = initState;

    this._joint = this.getPhysicWorld().createJoint(
      rigidBody,
      this,
      {type: this._type, options} as TJointParams
    );
  }

  /**
   * 禁用关节。
   */
  public disable() {
    this.getPhysicWorld().disableJoint(this);
  }

  /**
   * 启用关节。
   */
  public enable() {
    this.getPhysicWorld().enableJoint(this);
  }

  // public updateEquations() {

  // }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    const physicWorld = this.getPhysicWorld();

    setTimeout(
      () => {
        if (this._owner && this._owner.rigidBody) {
          physicWorld.removeJoint(this._owner.rigidBody, this);
        }
      },
      0
    );
  }
}
