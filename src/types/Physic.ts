/**
 * @File   : Physic.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/22/2018, 8:11:52 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {Vector3, Quaternion} from '../Core/Math';
import RigidBodyComponent, {IRigidBodyComponentState} from '../Physic/RigidBodyComponent';
import ColliderComponent from '../Physic/ColliderComponent';
import SceneActor from '../Renderer/ISceneActor';
import JointComponent from 'Physic/JointComponent';

/**
 * 支持的碰撞体类型枚举。
 */
export enum EColliderType {
  /**
   * 没有碰撞体。
   */
  Null = 0,
  /**
   * 球碰撞体。
   */
  Sphere = 1,
  /**
   * 盒碰撞体。
   */
  Box = 2,
  /**
   * 平面碰撞体。
   */
  Plane = 3,
  /**
   * 柱状碰撞体。
   */
  Cylinder = 4
  // todo: support terrain
  // Terrain = 5,
  // Particle = 6,
  // Mesh = 7
}

/**
 * 支持的刚体类型枚举。
 */
export enum ERigidBodyType {
  /**
   * 动态的，等同于`physicStatic = false`。
   */
  Dynamic = 1,
  /**
   * 静态的，等同于`physicStatic = true`。
   */
  Static = 2
}

/**
 * 支持的关节类型枚举。
 */
export enum EJointType {
  /**
   * 点对点约束。
   */
  PointToPoint = 0,
  /**
   * 铰链约束。
   */
  Hinge = 1,
  /**
   * 距离约束。
   */
  Distance = 2,
  /**
   * 弹簧约束。
   */
  Spring = 3,
  /**
   * 锁定约束。
   */
  Lock = 4
}

/**
 * 支持的拾取模式枚举。
 */
export enum EPickMode {
  /**
   * 只拾取距离摄像机最近的刚体，性能最佳。
   * 
   * @deprecated
   */
  CLOSEST = 1,
  /**
   * 只拾取距离摄像机最近的刚体，性能最佳。
   */
  Closest = 1,
  /**
   * 拾取任意的刚体。
   */
  Any = 2,
  /**
   * 拾取所有的刚体。
   */
  All = 4
}

/**
 * 碰撞体的通用参数。
 */
export interface IColliderCommonOptions {
  /**
   * 是否是触发器，若是，则只会触发碰撞事件而不会产生物理效应。
   */
  isTrigger?: boolean;
  /**
   * 碰撞体的初始偏移。为 **[x, y, z]**。
   */
  offset?: number[];
  /**
   * 碰撞体的初始四元数，用于设置旋转偏移。为 **[x, y, z, w]**。
   */
  quaternion?: number[];
  // friction?: number;
  // restitution?: number;
  // 默认生成碰撞体的依据
  // bindComponent?: SceneComponent;
  // todo: 绑定到特定Node并跟随变换
  // enableBind?: boolean;
  // todo: 绑定到特定骨骼并跟随变换
  // bindBone?: never;
}

/**
 * 盒碰撞体的参数。
 */
export interface IBoxColliderOptions extends IColliderCommonOptions {
  /**
   * 尺寸。为 **[width, height, depth]**。
   */
  size: number[];
}

/**
 * 球碰撞体的参数。
 */
export interface ISphereColliderOptions extends IColliderCommonOptions {
  /**
   * 半径。
   */
  radius: number;
}

/**
 * 柱状碰撞体的参数。
 */
export interface ICylinderColliderOptions extends IColliderCommonOptions {
  /**
   * 上圆面半径。
   */
  radiusTop: number;
  /**
   * 下圆面半径。
   */
  radiusBottom: number;
  /**
   * 高度。
   */
  height: number;
  /**
   * 片段数量。
   */
  numSegments: number;
}

/**
 * 平面碰撞体的参数。
 */
export interface IPlaneColliderOptions extends IColliderCommonOptions {}

/**
 * 碰撞体具体的参数。
 */
export type TColliderParams = {
    type: EColliderType.Null,
    options: IColliderCommonOptions
  } |{
    type: EColliderType.Box,
    options: IBoxColliderOptions
  } | {
    type: EColliderType.Sphere,
    options: ISphereColliderOptions
  } |  {
    type: EColliderType.Cylinder,
    options: ICylinderColliderOptions
  } | {
    type: EColliderType.Plane,
    options: IPlaneColliderOptions
  };

/**
 * 关节的通用参数。
 */
export interface IJointCommonOptions {
  /**
   * 需要约束的、拥有`RigidBody`的`SceneActor`。
   */
  actor: SceneActor;
  /**
   * 是否要合并碰撞体。
   * 
   * @default true
   */
  collideConnected?: boolean;
  /**
   * 是否要唤醒刚体。
   * 
   * @default true
   */
  wakeUpBodies?: boolean;
}

/**
 * 点对点约束关节的参数。
 */
export interface IPointToPointJointOptions extends IJointCommonOptions {
  /**
   * 约束点距离自身Actor质心的偏移。
   * 
   * @default [0,0,0]
   */
  pivotA?: Vector3;
  /**
   * 约束点距离另一个Actor质心的偏移。
   * 
   * @default [0,0,0]
   */
  pivotB?: Vector3;
  /**
   * 最大力约束。
   * 
   * @default 1e6
   */
  maxForce?: number;
}

/**
 * 铰链约束关节的参数。
 */
export interface IHingeJointOptions extends IJointCommonOptions {
  /**
   * 自身轴的中心距离质心的偏移。
   * 
   * @default [0,0,0]
   */
  pivotA?: Vector3;
  /**
   * 自身可以绕着转动的轴。
   * 
   * @default [1,0,0]
   */
  axisA?: Vector3;
  /**
   * 另一个Actor轴距离质心的偏移。
   * 
   * @default [0,0,0]
   */
  pivotB?: Vector3;
  /**
   * 另一个Actor可以绕着转动的轴。
   * 
   * @default [1,0,0]
   */
  axisB?: Vector3;
  /**
   * 最大力约束。
   * 
   * @default 1e6
   */
  maxForce?: number;
}

/**
 * 距离约束关节的参数。
 */
export interface IDistanceJointOptions extends IJointCommonOptions {
  /**
   * 距离约束。
   * 
   * @default 初始距离
   */
  distance?: number;
  /**
   * 最大力约束。
   * 
   * @default 1e6
   */
  maxForce?: number;
}

/**
 * 弹簧约束关节的参数。
 */
export interface ISpringJointOptions extends IJointCommonOptions {
  /**
   * 原始长度。
   * 
   * @default 1
   */
  restLength?: number;
  /**
   * 刚度。
   * 
   * @default 100
   */
  stiffness?: number;
  /**
   * 阻尼。
   * 
   * @default 1
   */
  damping?: number;
  /**
   * 自身在世界坐标下的，被弹簧勾住的基准点。
   * 
   * @default 初始位置。
   */
  worldAnchorA?: Vector3;
  /**
   * 另一个Actor在世界坐标下的，被弹簧勾住的基准点。
   * 
   * @default 初始位置。
   */
  worldAnchorB?: Vector3;
  /**
   * 自身在本地坐标下的，被弹簧勾住的基准点。
   * 
   * @default [0,0,0]
   */
  localAnchorA?: Vector3;
  /**
   * 另一个Actor在本地坐标下的，被弹簧勾住的基准点。
   * 
   * @default [0,0,0]
   */
  localAnchorB?: Vector3;
}

/**
 * 锁定约束关节的参数。
 */
export interface ILockJointOptions extends IJointCommonOptions {
  /**
   * 最大力约束。
   * 
   * @default 1e6
   */
  maxForce?: number;
}

/**
 * 关节具体的参数。
 */
export type TJointParams = {
  type: EJointType.PointToPoint,
  options: IPointToPointJointOptions
} |{
  type: EJointType.Distance,
  options: IDistanceJointOptions
} | {
  type: EJointType.Hinge,
  options: IHingeJointOptions
} |  {
  type: EJointType.Spring,
  options: ISpringJointOptions
} | {
  type: EJointType.Lock,
  options: ILockJointOptions
};

/**
 * 拾取参数类型接口。
 */
export interface IPickOptions {
  /**
   * 拾取触发类型，`up`为当鼠标或触摸结束时触发，`down`为开始时触发，`custom`则没有默认的触发器，需要自己通过调用`picker.pick`实现。
   * 详见[../../guide/pick.md]。
   */
  type?: 'up' | 'down' | 'custom';
  /**
   * 拾取模式，详见枚举值定义。
   */
  mode?: EPickMode;
  /**
   * 指定需要进行拾取检测的刚体组件，若不传则检测世界中的所有刚体。是一个性能优化或者限制玩家的方式。
   */
  bodies?: RigidBodyComponent[];
  /**
   * 一个回调，若指定，则会在每次拾取完成后、触发拾取事件前调用，来筛选出真正预期拾取到的结果。
   * 一般用于特殊状况，比如在多个检测对象中筛选出需要的对象。
   */
  filter?(results: IPickResult[]): IPickResult[];
  /**
   * 当次拾取需要生成的射线长度。
   */
  rayLength?: number;
  /**
   * 是否需要检测碰撞效应。
   * 
   * @default false
   */
  checkCollisionResponse?: boolean;
  /**
   * 是否需要跳过处于背面的刚体。
   * 
   * @default true
   */
  skipBackfaces?: boolean;
  /**
   * 生成检测用射线的`filterMask`，也是一个限定玩家的手段。
   */
  collisionFilterMask?: number;
  /**
   * 生成检测用射线的`filterGroup`，也是一个限定玩家的手段。
   */
  collisionFilterGroup?: number;
}

/**
 * 拾取检测的结果。
 */
export interface IPickResult {
  /**
   * 拾取到的刚体组件的父级Actor实例引用。
   */
  actor: SceneActor;
  /**
   * 拾取到的刚体组件的实例引用。
   */
  rigidBody: RigidBodyComponent;
  /**
   * 拾取到的碰撞体组件的实例引用。
   */
  collider: ColliderComponent;
  /**
   * 拾取到的对象上的点到相机的距离。
   */
  distance: number;
  /**
   * 拾取到的对象上的碰撞点的世界坐标。
   */
  point: Vector3;
}

/**
 * 碰撞事件的参数类型。
 */
export interface ICollisionEvent {
  /**
   * 自身的刚体组件实例引用。
   */
  selfBody: RigidBodyComponent;
  /**
   * 被自身碰撞到的刚体组件实例引用。
   */
  otherBody: RigidBodyComponent;
  /**
   * 被自身碰撞到的刚体组件的父级Actor实例引用。
   */
  selfActor: SceneActor;
  /**
   * 自身的刚体组件的父级Actor实例引用。
   */
  otherActor: SceneActor;
}

/**
 * 带有碰撞体详情的碰撞事件的参数类型。
 */
export interface IColliderCollisionEvent extends ICollisionEvent {
  /**
   * 自身的碰撞体组件实例引用。
   */
  selfCollider: ColliderComponent;
  /**
   * 被自身碰撞到的的碰撞体组件实例引用。
   */
  otherCollider: ColliderComponent;
}

/**
 * 物理世界接口，实现其可实现任意物理引擎到Sein.js的桥接。
 * 引擎默认实现了一个桥接，若想扩展可以仿照，见[CannonPhysicWorld](../cannonphysicworld)。
 */
export interface IPhysicWorld extends SObject {
  isPhysicWorld: boolean;
  timeStep: number;
  setGravity(gravity: Vector3): void;
  initContactEvents(): void;
  update(delta?: number, components?: RigidBodyComponent[]): void;
  applyImpulse(component: RigidBodyComponent, force: Vector3, contactPoint: Vector3): void;
  applyForce(component: RigidBodyComponent, force: Vector3, contactPoint: Vector3): void;
  pick(
    from: Vector3,
    to: Vector3,
    onPick: (result: IPickResult[]) => void,
    options?: IPickOptions
  ): boolean;
  clear(): void;
  createRigidBody(component: RigidBodyComponent, options: IRigidBodyComponentState): any;
  initEvents(component: RigidBodyComponent): void;
  removeRigidBody(component: RigidBodyComponent): void;
  disableRigidBody(component: RigidBodyComponent): void;
  enableRigidBody(component: RigidBodyComponent): void;
  createCollider(bodyComp: RigidBodyComponent, colliderComp: ColliderComponent, params: TColliderParams): any;
  removeCollider(rigidBody: RigidBodyComponent, collider: ColliderComponent): void;
  createJoint(component: RigidBodyComponent, jointComp: JointComponent, params: TJointParams): any;
  removeJoint(component: RigidBodyComponent, joint: JointComponent): void;
  disableJoint(joint: JointComponent): void;
  enableJoint(joint: JointComponent): void;
  setRootTransform(component: RigidBodyComponent): void;
  setRigidBodyTransform(component: RigidBodyComponent, newPosition: Vector3, newRotation: Quaternion, newScale?: Vector3): void;
  setColliderTransform(component: ColliderComponent, newPosition: Vector3, newRotation: Quaternion, newScale?: Vector3): void;
  updateBounding(component: RigidBodyComponent): void;
  setLinearVelocity(component: RigidBodyComponent, velocity: Vector3): void;
  setAngularVelocity(component: RigidBodyComponent, velocity: Vector3): void;
  getLinearVelocity(component: RigidBodyComponent): Vector3;
  getAngularVelocity(component: RigidBodyComponent): Vector3;
  setBodyMass(component: RigidBodyComponent, mass: number): void;
  getBodyMass(component: RigidBodyComponent): number;
  setFilterGroup(component: RigidBodyComponent, group: number): void;
  getFilterGroup(component: RigidBodyComponent): number;
  setFilterMask(component: RigidBodyComponent, mask: number): void;
  getFilterMask(component: RigidBodyComponent): number;
  setColliderIsTrigger(component: ColliderComponent, isTrigger: boolean): void;
  getColliderIsTrigger(component: ColliderComponent): boolean;
  getBodyFriction(component: RigidBodyComponent): number;
  setBodyFriction(component: RigidBodyComponent, friction: number): void;
  getBodyRestitution(component: RigidBodyComponent): number;
  setBodyRestitution(component: RigidBodyComponent, restitution: number): void;
  sleepBody(component: RigidBodyComponent): void;
  wakeUpBody(component: RigidBodyComponent): void;
  setBodyType(component: RigidBodyComponent, type: ERigidBodyType): void;
}
