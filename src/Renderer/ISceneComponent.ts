/**
 * @File   : ISceneComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/17/2018, 4:10:38 PM
 * @Description:
 */
import * as Math from '../Core/Math';
import Component from '../Core/Component';
import Hilo3d from '../Core/Hilo3d';
import ISceneActor from '../Renderer/ISceneActor';
import SArray from '../DataStructure/SArray';
import {INodeWithGlTFExtensions} from '../types/Resource';
import SObject from '../Core/SObject';

/**
 * SceneComponent的初始化参数类型。
 */
export interface ISceneComponentState {
  /**
   * 初始位置数据。
   */
  position?: Math.Vector3;
  /**
   * 初始旋转数据。
   */
  rotation?: Math.Euler;
  /**
   * 初始缩放数据。
   */
  scale?: Math.Vector3;
  /**
   * 初始锚点数据。
   */
  pivot?: Math.Vector3;
  /**
   * 初始四元数数据。
   */
  quaternion?: Math.Quaternion;
  /**
   * 初始本地矩阵数据。
   */
  matrix?: Math.Matrix4;
  /**
   * 初始是否可见。
   */
  visible?: boolean;
  /**
   * 是否是从GlTF中实例化的，**不要自己使用！**
   */
  __fromGlTF?: boolean;
}

export function isSceneComponent(value: SObject): value is ISceneComponent {
  return (value as ISceneComponent).isSceneComponent;
}

export default interface ISceneComponent<IStateTypes extends ISceneComponentState = ISceneComponentState> extends Component<IStateTypes> {
  isSceneComponent: boolean;
  needReleaseGlRes: boolean;
  readonly parent: ISceneActor | ISceneComponent;
  readonly children: SArray<ISceneComponent<ISceneComponentState>>;
  readonly hiloNode: Hilo3d.Node;
  visible: boolean;
  position: Math.Vector3;
  rotation: Math.Euler;
  scale: Math.Vector3;
  pivot: Math.Vector3;
  quaternion: Math.Quaternion;
  readonly matrix: Math.Matrix4;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  pivotX: number;
  pivotY: number;
  pivotZ: number;
  worldMatrix: Math.Matrix4;
  absolutePosition: Math.Vector3;
  readonly ndcPosition: Hilo3d.Vector3;
  readonly forwardVector: Hilo3d.Vector3;
  readonly upVector: Hilo3d.Vector3;
  readonly rightVector: Hilo3d.Vector3;
  onInit(initState?: IStateTypes): void;
  onAdd(initState?: IStateTypes): void;
  onDestroy(): void;
  update(delta: number): void;
  getBounds(bounds?: Math.Bounds, currentMatrix?: Math.Matrix4): Math.Bounds;
  addChild(component: ISceneComponent): this;
  removeChild(component: ISceneComponent): this;
  setPosition(x: number, y: number, z: number): this;
  setRotation(x: number, y: number, z: number): this;
  setScale(x: number, y: number, z: number): this;
  setPivot(x: number, y: number, z: number): this;
  setQuaternion(x: number, y: number, z: number, w: number): this;
  setAbsolutePosition(x: number, y: number, z: number): this;
  translate(axis: Math.Vector3, distance: number): this;
  rotate(axis: Math.Vector3, rad: number): this;
  updateMatrixWorld(force?: boolean): this;
  removeFromParent(): void;
  lookAt(target: Math.Vector3 | ISceneActor | ISceneComponent): this;
  cloneFromHiloNode(node: INodeWithGlTFExtensions): void;
}
