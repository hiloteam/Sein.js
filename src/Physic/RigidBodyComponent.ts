/**
 * @File   : RigidBodyComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/23/2018, 4:46:37 PM
 * @Description:
 */
import {isLevel} from '../Core/Level';
import {SClass} from '../Core/Decorator';
import EventManager from '../Event/EventManager';
import Component from '../Core/Component';
import {Vector3, Quaternion} from '../Core/Math';
import SceneActor from '../Renderer/ISceneActor';
import ColliderComponent from '../Physic/ColliderComponent';
import {ICollisionEvent, IColliderCollisionEvent, IPickResult, IColliderCommonOptions, ERigidBodyType} from '../types/Physic';
import UnmetRequireException from '../Exception/UnmetRequireException';
import MemberConflictException from '../Exception/MemberConflictException';
import SObject from '../Core/SObject';

/**
 * `RigidBodyComponent`的初始化参数类型。
 */
export interface IRigidBodyComponentState {
  /**
   * 刚体重力。
   */
  mass: number;
  /**
   * 刚体摩擦力。
   */
  friction?: number;
  /**
   * 刚体弹性系数。
   */
  restitution?: number;
  /**
   * 刚体是否处于不可控状态，即父级Actor的transform变换不会影响到物理世界刚体的transform。
   * 一般用于纯静态物体，进行性能优化。
   */
  unControl?: boolean;
  /**
   * 物理世界的刚体是否是静态的，这会导致物理世界刚体的transform不会影响到父级Actor的transform。
   * 一般用于纯物理静态物体，进行性能优化。
   */
  physicStatic?: boolean;
  /**
   * 初始是否处于睡眠状态。一般用于完全不想让此刚体参与除了拾取外任何碰撞处理的场合。
   * 
   * @default sleeping false
   */
  sleeping?: boolean;
  /**
   * filterMask，一个32bits的整数，用于给分组后的刚体设置碰撞对象范围。
   */
  filterMask?: number;
  /**
   * 一个32bits的整数，用于给刚体分组。
   */
  filterGroup?: number;
  nativeOptions?: any;
}

/**
 * `RigidBodyComponent`的事件定义。
 */
export interface IColliderDefaultEvents {
  /**
   * 碰撞事件，当两个刚体发生碰撞时触发。
   */
  Collision: ICollisionEvent;
  /**
   * 碰撞事件，当一个刚体进入另一个刚体时触发。
   * **只有在开启了高级碰撞事件后才会触发。**
   */
  BodyEnter: ICollisionEvent;
  /**
   * 碰撞事件，当一个刚体离开另一个刚体时触发。
   * **只有在开启了高级碰撞事件后才会触发。**
   */
  BodyLeave: ICollisionEvent;
  /**
   * 碰撞事件，当一个碰撞体进入另一个碰撞体时触发。
   * **只有在开启了高级碰撞事件后才会触发。**
   */
  ColliderEnter: IColliderCollisionEvent;
  /**
   * 碰撞事件，当一个碰撞体离开另一个碰撞体时触发。
   * **只有在开启了高级碰撞事件后才会触发。**
   */
  ColliderLeave: IColliderCollisionEvent;
  /**
   * 拾取事件。需要配合[PhysicPicker](../../classes/physicpicker)一起使用。
   */
  Pick: IPickResult;
  /**
   * 在每一次同步父级Actor的transform到物理世界的刚体后触发。
   */
  BeforeStep: RigidBodyComponent;
  /**
   * 在每一次同步物理世界刚体的transform到父级Actor前触发。
   */
  AfterStep: RigidBodyComponent;
}

/**
 * 判断一个实例是否为`RigidBodyComponent`。
 */
export function isRigidBodyComponent(value: SObject): value is RigidBodyComponent {
  return (value as RigidBodyComponent).isRigidBodyComponent;
}

/**
 * @hidden
 */
const vec3Unit = new Vector3(1, 1, 1);

/**
 * @hidden
 */
const vec3Zero = new Vector3(0, 0, 0);

/**
 * 刚体组件类，为Actor添加物理引擎和碰撞检测、拾取的基本功能。
 * **当挂载到Actor后，你可以直接通过`actor.rigidBody`来访问它。**
 * 
 * @noInheritDoc
 */
@SClass({className: 'RigidBodyComponent', classType: 'RigidBody'})
export default class RigidBodyComponent extends Component<IRigidBodyComponentState> {
  public isRigidBodyComponent = true;
  /**
   * 不要自己使用。
   * 
   * @hidden
   */
  public needUpdateCollider: boolean = false;

  protected _event: EventManager<IColliderDefaultEvents>;
  protected _rigidBody: {
    component: RigidBodyComponent;
    [key: string]: any;
  };
  protected _owner: SceneActor;
  protected _unControl: boolean;
  protected _physicStatic: boolean;
  protected _disabled: boolean = false;
  protected _sleeping: boolean = false;

  private _valid: boolean = false;
  private _tmpQuat: Quaternion = new Quaternion();
  private _tmpQuat2: Quaternion = new Quaternion();
  private _tmpScale: Vector3 = new Vector3(1, 1, 1);
  private _tmpScale2: Vector3 = new Vector3(1, 1, 1);
  private _tmpScale3: Vector3 = new Vector3(1, 1, 1);

  /**
   * 获取物理世界的刚体，不需要自己使用。
   * 
   * @hidden
   */
  get rigidBody() {
    return this._rigidBody;
  }

  /**
   * 刚体当前是否有效，不需要自己使用。
   * 
   * @hidden
   */
  get valid(): boolean {
    return this._valid;
  }

  /**
   * RigidBodyComponent的事件管理器。
   */
  get event() {
    return this._event;
  }

  /**
   * 设置重力。
   */
  set mass(value: number) {
    this.getPhysicWorld().setBodyMass(this, value);
  }

  /**
   * 获取重力。
   */
  get mass() {
    return this.getPhysicWorld().getBodyMass(this);
  }

  /**
   * 设置filterGroup，一个32bits的整数，用于给刚体分组。
   */
  set filterGroup(value: number) {
    this.getPhysicWorld().setFilterGroup(this, value);
  }

  /**
   * 获取filterGroup。
   */
  get filterGroup() {
    return this.getPhysicWorld().getFilterGroup(this);
  }

  /**
   * 设置filterMask，一个32bits的整数，用于给分组后的刚体设置碰撞对象范围。
   */
  set filterMask(value: number) {
    this.getPhysicWorld().setFilterMask(this, value);
  }

  /**
   * 获取filterMask。
   */
  get filterMask() {
    return this.getPhysicWorld().getFilterMask(this);
  }

  /**
   * 设置刚体摩擦力。
   */
  set friction(value: number) {
    this.getPhysicWorld().setBodyFriction(this, value);
  }

  /**
   * 获取刚体摩擦力。
   */
  get friction() {
    return this.getPhysicWorld().getBodyFriction(this);
  }

  /**
   * 设置刚体弹性系数。
   */
  set restitution(value: number) {
    this.getPhysicWorld().setBodyRestitution(this, value);
  }

  /**
   * 获取刚体弹性系数。
   */
  get restitution() {
    return this.getPhysicWorld().getBodyRestitution(this);
  }

  /**
   * 设置刚体是否处于不可控状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
   */
  set unControl(value: boolean) {
    this._unControl = value;
  }

  /**
   * 获取刚体是否处于不可控状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
   */
  get unControl() {
    return this._unControl;
  }

  /**
   * 设置刚体是否处于物理静止状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
   */
  set physicStatic(value: boolean) {
    this._physicStatic = value;
    this.getPhysicWorld().setBodyType(this, value ? ERigidBodyType.Static : ERigidBodyType.Dynamic);
  }

  /**
   * 获取刚体是否处于物理静止状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
   */
  get physicStatic() {
    return this._physicStatic;
  }

  /**
   * 刚体组件目前是否停止运作。
   */
  get disabled() {
    return this._disabled;
  }

  public verifyAdding() {
    if (!this.getPhysicWorld()) {
      throw new UnmetRequireException(this, 'Physic world is required for adding RigidBodyComponent !');
    }

    if (this._owner.findComponentByClass(RigidBodyComponent)) {
      throw new MemberConflictException(this._owner, 'RigidBodyComponent', this.name, this);
    }
  }

  public onInit(initState: IRigidBodyComponentState) {
    this._unControl = initState.unControl || false;
    this._physicStatic = initState.physicStatic || false;

    if (typeof initState.filterMask !== 'undefined') {
      this.filterMask = initState.filterMask;
    }

    if (typeof initState.filterGroup !== 'undefined') {
      this.filterGroup = initState.filterGroup;
    }

    this._event.register('Pick');
    this._event.register('Collision');
    this._event.register('BodyEnter');
    this._event.register('BodyLeave');
    this._event.register('ColliderEnter');
    this._event.register('ColliderLeave');
    this._event.register('BeforeStep');
    this._event.register('AfterStep');

    // fixme: hack for performance
    (this._owner as any)._rigidBody = this;
  }

  /**
   * 添加到世界，继承请先`super.onAdd()`。
   */
  public onAdd(initState: IRigidBodyComponentState) {
    this._rigidBody = this.getPhysicWorld().createRigidBody(this, initState);
    this.getPhysicWorld().initEvents(this);
    this._valid = true;

    if (initState.sleeping === true) {
      this.sleep();
    }
  }

  /**
   * 从世界中暂时移除，继承请先`super.onUnLink()`。
   */
  public onUnLink() {
    this.disable();
  }

  /**
   * 重连世界，继承请先`super.onReLink()`。
   */
  public onReLink() {
    this.enable();
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    this._valid = false;
    const physicWorld = this.getPhysicWorld();
    setTimeout(() => physicWorld.removeRigidBody(this), 0);

    if (this._owner.rigidBody === this) {
      (this._owner as any)._rigidBody = null;
    }
  }

  /**
   * 暂时使得刚体失去效应，可以用`enable`恢复。
   */
  public disable() {
    this.getPhysicWorld().disableRigidBody(this);
    this._disabled = true;
  }

  /**
   * 使得一个暂时失去效应的刚体恢复。
   */
  public enable() {
    this.getPhysicWorld().enableRigidBody(this);
    this._disabled = false;
  }

  /**
   * 获取质心。
   */
  public getMassCenter(): Vector3 {
    return this._owner.transform.position;
  }

  /**
   * 设置刚体的父级Actor的`transform`。
   */
  public setRootTransform() {
    this.getPhysicWorld().setRootTransform(this);

    return this;
  }

  /**
   * 设置刚体的`transform`。
   */
  public setRigidBodyTransform(newPosition: Vector3, newRotation: Quaternion) {
    this.getPhysicWorld().setRigidBodyTransform(this, newPosition, newRotation);

    return this;
  }

  /**
   * 设置线速度。
   */
  public setLinearVelocity(velocity: Vector3) {
    this.getPhysicWorld().setLinearVelocity(this, velocity);

    return this;
  }

  /**
   * 设置角速度。
   */
  public setAngularVelocity(velocity: Vector3) {
    this.getPhysicWorld().setAngularVelocity(this, velocity);

    return this;
  }

  /**
   * 获取线速度。
   */
  public getLinearVelocity() {
    return this.getPhysicWorld().getLinearVelocity(this);
  }

  /**
   * 获取角速度。
   */
  public getAngularVelocity() {
    return this.getPhysicWorld().getAngularVelocity(this);
  }

  /**
   * 使刚体进入睡眠状态，不会触发任何碰撞事件，但可以正确响应拾取操作。
   */
  public sleep() {
    this.getPhysicWorld().sleepBody(this);
    this._sleeping = true;

    return this;
  }

  /**
   * 唤醒刚体。
   */
  public wakeUp() {
    this.getPhysicWorld().wakeUpBody(this);
    this._sleeping = false;

    return this;
  }

  /**
   * 强制同步物理刚体的transform到组件父级Actor。
   */
  public forceSync() {
    this.handleBeforeStep(null, true);

    return this;
  }

  protected getParentsRotationAndScale() {
    let parent = this._owner.parent;

    this._tmpQuat.set(0, 0, 0, 1);
    this._tmpScale.set(1, 1, 1);

    while (parent && !isLevel(parent)) {
      const actor = parent.getOwner<SceneActor>();

      this._tmpQuat2.copy(actor.transform.quaternion);
      this._tmpQuat.multiply(this._tmpQuat2);
      this._tmpScale2.copy(actor.transform.scale);
      this._tmpScale.multiply(this._tmpScale2);

      parent = actor.parent;
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleCollision = ({body, contact}) => {
    let other;
    let self;
    if (body.id === contact.bi.id) {
      self = contact.bj;
      other = contact.bi;
    } else {
      self = contact.bi;
      other = contact.bj;
    }

    if (!this._valid || !other.component.valid) {
      return;
    }

    this.event.trigger('Collision', {
      selfBody: self.component,
      otherBody: other.component,
      selfActor: self.component.getOwner(),
      otherActor: other.component.getOwner()
    });
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleBodyEnter = (
    selfBody: RigidBodyComponent,
    otherBody: RigidBodyComponent
  ) => {
    if (!this._valid || !otherBody.valid) {
      return;
    }

    this.event.trigger('BodyEnter', {selfBody, otherBody, selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner()});
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleBodyLeave = (
    selfBody: RigidBodyComponent,
    otherBody: RigidBodyComponent
  ) => {
    if (!this._valid || !otherBody.valid) {
      return;
    }

    this.event.trigger('BodyLeave', {selfBody, otherBody, selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner()});
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleColliderEnter = (
    selfBody: RigidBodyComponent,
    otherBody: RigidBodyComponent,
    selfCollider: ColliderComponent,
    otherCollider: ColliderComponent
  ) => {
    if (!this._valid || !otherBody.valid) {
      return;
    }

    this.event.trigger('ColliderEnter', {
      selfBody, otherBody, selfCollider, otherCollider,
      selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner()
    });
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleColliderLeave = (
    selfBody: RigidBodyComponent,
    otherBody: RigidBodyComponent,
    selfCollider: ColliderComponent,
    otherCollider: ColliderComponent
  ) => {
    if (!this._valid || !otherBody.valid) {
      return;
    }

    this.event.trigger('ColliderLeave', {
      selfBody, otherBody, selfCollider, otherCollider,
      selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner()
    });
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public getCurrentTransform(): [Vector3, Quaternion, Vector3] {
    const {transform} = this._owner;

    transform.updateMatrixWorld(true);

    if (this._owner.parent && !isLevel(this._owner.parent)) {
      this.getParentsRotationAndScale();
      this._tmpQuat.multiply(transform.quaternion);

      this._tmpScale.multiply(transform.scale);
    } else {
      this._tmpQuat.copy(transform.quaternion);

      this._tmpScale.copy(transform.scale);
    }

    return [transform.absolutePosition, this._tmpQuat, this._tmpScale];
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleBeforeStep = (_, forceSync: boolean = false) => {
    if (!this._valid) {
      return;
    }

    if (this._physicStatic && !this._sleeping && this.mass !== 0) {
      this.setAngularVelocity(vec3Zero);
      this.setLinearVelocity(vec3Zero);
    }

    this.syncTransformToRigidBody(forceSync);

    this.event.trigger('BeforeStep', this);
  }

  private syncTransformToRigidBody(forceSync: boolean) {
    // todo: bug: change this.box.transform.position & change this.box.transform.scale.x = .3;
    const {transform} = this._owner;

    if (this.needUpdateCollider) {
      this.getPhysicWorld().updateBounding(this);
      this.needUpdateCollider = false;
    }

    if (!forceSync && this._unControl) {
      return;
    }

    if (forceSync) {
      transform.updateMatrixWorld(true);
    }
    
    this._tmpScale3.copy(this._tmpScale);
    if (this._owner.parent && !isLevel(this._owner.parent)) {
      this.getParentsRotationAndScale();
      this._tmpQuat.multiply(transform.quaternion);
      this._tmpScale.multiply(transform.scale);
    } else {
      this._tmpQuat.copy(transform.quaternion);
      this._tmpScale.copy(transform.scale);
    }
    const updateScale = (forceSync && !this._tmpScale.equals(vec3Unit)) || !this._tmpScale.equals(this._tmpScale3);

    this.getPhysicWorld().setRigidBodyTransform(
      this,
      transform.absolutePosition,
      this._tmpQuat,
      updateScale ? this._tmpScale : null
    );

    if (forceSync) {
      this.getPhysicWorld().updateBounding(this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handleAfterStep = () => {
    if (!this.valid) {
      return;
    }

    if (this._physicStatic || this._sleeping) {
      return;
    }

    const {transform} = this._owner;

    this.event.trigger('AfterStep', this);

    this.getPhysicWorld().setRootTransform(this);
    // object has now its world rotation. needs to be converted to local.
    if (this._owner.parent) {
      this.getParentsRotationAndScale();
      this._tmpQuat.conjugate();
      transform.quaternion = this._tmpQuat.multiply(transform.quaternion);
    }
    // take the position set and make it the absolute position of this object.
    transform.absolutePosition = transform.position;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public handlePick = (result: IPickResult) => {
    this.event.trigger('Pick', result);
  }
}
