/**
 * @File   : ColliderComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午6:00:24
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Component from '../Core/Component';
import {EColliderType, TColliderParams, IColliderCommonOptions} from '../types/Physic';
import SceneActor from '../Renderer/ISceneActor';
import BreakGuardException from '../Exception/BreakGuardException';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`ColliderComponent`。
 */
export function isColliderComponent(value: SObject): value is ColliderComponent {
  return (value as ColliderComponent).isColliderComponent;
}

/**
 * 碰撞体组件基类。一般不自己使用，而是交由继承的类实现多态。
 * 
 * @template IStateTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * @noInheritDoc
 */
@SClass({className: 'ColliderComponent'})
export default class ColliderComponent<IStateTypes extends IColliderCommonOptions = IColliderCommonOptions> extends Component<IStateTypes> {
  public isColliderComponent = true;

  protected _type: EColliderType = EColliderType.Null;
  protected _owner: SceneActor;
  protected _collider: {component: ColliderComponent, [key: string]: any};

  /**
   * 获取物理世界的碰撞体，不要自己操作。
   * 
   * @hidden
   */
  get collider() {
    return this._collider;
  }

  /**
   * 获取碰撞体类型。
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

  // set friction(value: number) {
  //   this.getPhysicWorld().setColliderFriction(this, value);
  // }

  // get friction() {
  //   return this.getPhysicWorld().getColliderFriction(this);
  // }

  // set restitution(value: number) {
  //   this.getPhysicWorld().setColliderRestitution(this, value);
  // }

  // get restitution() {
  //   return this.getPhysicWorld().getColliderRestitution(this);
  // }

  /**
   * 设置是否是触发器。
   */
  set isTrigger(value: boolean) {
    this.getPhysicWorld().setColliderIsTrigger(this, value);
  }

  /**
   * 获取是否是触发器。
   */
  get isTrigger() {
    return this.getPhysicWorld().getColliderIsTrigger(this);
  }

  /**
   * 开发环境下，验证可添加性。
   */
  public verifyAdding() {
    const {rigidBody} = this._owner;

    if (!rigidBody) {
      throw new BreakGuardException(this, 'RigidBodyComponent must be added before adding ColliderComponent !');
    }
  }

  /**
   * 添加到世界，继承请先`super.onAdd()`。
   */
  public onAdd(initState: IStateTypes) {
    const {rigidBody} = this._owner;
    const options: IStateTypes = this._initState = initState || this.getDefaultOptions();
    options.offset = options.offset || [0, 0, 0];
    options.quaternion = options.quaternion || [0, 0, 0, 1];

    this._collider = this.getPhysicWorld().createCollider(
      rigidBody,
      this,
      {type: this._type, options} as TColliderParams
    );
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    const physicWorld = this.getPhysicWorld();

    setTimeout(
      () => {
        if (this._owner && this._owner.rigidBody) {
          physicWorld.removeCollider(this._owner.rigidBody, this);
        }
      },
      0
    );
  }

  protected getDefaultOptions() {
    return null;
  }
}
