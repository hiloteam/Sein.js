/**
 * @File   : SceneComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午3:23:10
 * @Description:
 */
import Component from '../Core/Component';
import Hilo3d from '../Core/Hilo3d';
import * as Math from '../Core/Math';
import {SClass} from '../Core/Decorator';
import SArray from '../DataStructure/SArray';
import {INodeWithGlTFExtensions} from '../types/Resource';
import ISceneComponent, {ISceneComponentState} from '../Renderer/ISceneComponent';
import ISceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import CameraComponent from '../Camera/CameraComponent';
import Layers from '../Renderer/Layers';

export {ISceneComponentState};

/**
 * @hidden
 */
const tmpVec3 = new Math.Vector3();

/**
 * 判断一个实例是否为`SceneComponent`。
 */
export function isSceneComponent(value: SObject): value is SceneComponent {
  return (value as SceneComponent).isSceneComponent;
}

/**
 * 场景Component类，作为`SceneActor`的根组件，即为实际拥有3D变换功能的一类特殊Component。
 * 你可以直接使用它，也可以使用继承自它的那些类（比如`PrimitiveComponent`，图元组件，用于承载模型数据）。
 * SceneComponent实例可以以树状结构嵌套，但处于性能考虑，原则上一旦生成就不建议再去动态插拔子级实例。
 * 
 * @template IStateTypes 初始化参数类型，必须继承自[ISceneComponentState](../interfaces/iscenecomponentstate)。
 * @noInheritDoc
 */
@SClass({className: 'SceneComponent'})
export default class SceneComponent<
  IStateTypes extends ISceneComponentState = ISceneComponentState
> extends Component<IStateTypes> implements ISceneComponent<ISceneComponentState> {
  public isSceneComponent: boolean = true;
  /**
   * 是否需要在销毁时释放Gl资源，如果确定以后还会使用相同的材质、几何体等，可以设为`false`，性能优化。
   * 对于GlTF模型实例化的资源默认会设为`false`，而在资源释放时统一释放Gl资源。
   * 
   * @default true
   */
  public needReleaseGlRes: boolean = true;
  /**
   * 图层属性，详见[Layers](../layers)。
   */
  public layers: Layers = new Layers();

  protected _owner: ISceneActor;
  protected _parent: SceneComponent | ISceneActor;
  protected _children: SArray<SceneComponent> = new SArray();
  protected _node: Hilo3d.Node;

  private _tmpQuat = new Math.Quaternion();

  /**
   * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
   */
  get parent(): ISceneActor | SceneComponent {
    return this._parent || this._owner;
  }

  /**
   * 获取自身的所有子级SceneComponent，一般不需要自己使用。
   */
  get children() {
    return this._children;
  }

  /**
   * 底层hilo3d的节点，内部随时可能变更实现，**不要自己使用**。
   * 
   * @hidden
   */
  get hiloNode() {
    return this._node;
  }

  /**
   * 设置该组件在世界中是否可见。
   */
  set visible(value: boolean) {
    this._node.visible = value;
  }

  /**
   * 获取该组件在世界中是否可见。
   */
  get visible() {
    return this._node.visible;
  }

  /**
   * 设置是否为静态对象，若是，则从此层开始的所有子级实例都不会在每一帧更新`WorldMatrix`。
   * 用于性能优化。
   */
  set isStatic(value: boolean) {
    this._node.autoUpdateWorldMatrix = !value;
    (this._node as any).autoUpdateChildWorldMatrix = !value;
  }

  /**
   * 获取是否为静态对象，若是，则从此层开始的所有子级实例都不会在每一帧更新`WorldMatrix`。
   * 用于性能优化。
   */
  get isStatic() {
    return !this._node.autoUpdateWorldMatrix;
  }

  /**
   * 设置本地空间位置数据。
   */
  set position(position: Math.Vector3) {
    this._node.position.copy(position);
  }

  /**
   * 获取本地空间位置数据。
   */
  get position() {
    return this._node.position;
  }

  /**
   * 设置本地空间旋转数据。
   */
  set rotation(rotation: Math.Euler) {
    this._node.rotation.copy(rotation);
  }

  /**
   * 获取本地空间旋转数据。
   */
  get rotation() {
    return this._node.rotation;
  }

  /**
   * 设置本地空间缩放数据。
   */
  set scale(scale: Math.Vector3) {
    this._node.scale.copy(scale);
  }

  /**
   * 获取本地空间缩放数据。
   */
  get scale() {
    return this._node.scale;
  }

  /**
   * 设置本地空间锚点数据。
   */
  set pivot(pivot: Math.Vector3) {
    this._node.pivot.copy(pivot);
  }

  /**
   * 获取本地空间锚点数据。
   */
  get pivot() {
    return this._node.pivot;
  }

  /**
   * 设置本地空间四元数数据。
   */
  set quaternion(quaternion: Math.Quaternion) {
    this._node.quaternion.copy(quaternion);
  }

  /**
   * 获取本地空间四元数数据。
   */
  get quaternion() {
    return this._node.quaternion;
  }

  /**
   * 获取本地矩阵数据。
   */
  get matrix() {
    return this._node.matrix;
  }

  set x(value: number) {
    this.position.x = value;
  }

  get x() {
    return this.position.x;
  }

  set y(value: number) {
    this.position.y = value;
  }

  get y() {
    return this.position.y;
  }

  set z(value: number) {
    this.position.z = value;
  }

  get z() {
    return this.position.z;
  }

  set rotationX(value: number) {
    this.rotation.x = value;
  }

  get rotationX() {
    return this.rotation.x;
  }

  set rotationY(value: number) {
    this.rotation.y = value;
  }

  get rotationY() {
    return this.rotation.y;
  }

  set rotationZ(value: number) {
    this.rotation.z = value;
  }

  get rotationZ() {
    return this.rotation.z;
  }

  set scaleX(value: number) {
    this.scale.x = value;
  }

  get scaleX() {
    return this.scale.x;
  }

  set scaleY(value: number) {
    this.scale.y = value;
  }

  get scaleY() {
    return this.scale.y;
  }

  set scaleZ(value: number) {
    this.scale.z = value;
  }

  get scaleZ() {
    return this.scale.z;
  }

  set pivotX(value: number) {
    this.pivot.x = value;
  }

  get pivotX() {
    return this.pivot.x;
  }

  set pivotY(value: number) {
    this.pivot.y = value;
  }

  get pivotY() {
    return this.pivot.y;
  }

  set pivotZ(value: number) {
    this.pivot.z = value;
  }

  get pivotZ() {
    return this.pivot.z;
  }

  /**
   * 直接设置世界矩阵的数据。
   */
  set worldMatrix(matrix: Math.Matrix4) {
    this._node.worldMatrix.copy(matrix);
  }

  /**
   * 直接获取世界矩阵的数据。
   */
  get worldMatrix() {
    return this._node.worldMatrix;
  }

  /**
   * 直接获取组件在世界空间的位置数据。
   */
  get absolutePosition(): Math.Vector3 {
    return this._node.worldMatrix.getTranslation();
  }

  /**
   * 直接设置组件在世界空间的位置数据。
   * 
   * **注意此设置会涉及矩阵的clone和乘法，有一些性能开销，**
   */
  set absolutePosition(value: Math.Vector3) {
    const {parent} = this._node;

    if (parent) {
      const invertParentWorldMatrix = parent.worldMatrix.clone();
      invertParentWorldMatrix.invert();
      this.position = value.transformMat4(invertParentWorldMatrix);
    } else {
      this.position = value;
    }
  }

  /**
   * 直接获取组件在世界空间的旋转数据。
   * 
   * **注意此值从世界矩阵实时计算而来，有一些性能消耗。**
   */
  get absoluteRotation(): Math.Quaternion {
    const quat = new Math.Quaternion();
    return this._node.worldMatrix.getRotation(quat);
  }

  /**
   * 直接获取组件在世界空间的缩放数据。
   * 
   * **注意此值从世界矩阵实时计算而来，有一些性能消耗。**
   */
  get absoluteScale(): Math.Vector3 {
    return this._node.worldMatrix.getScaling();
  }

  /**
   * 直接获取组件在**当前摄像机**下标准设备空间的位置数据。
   * 
   * **注意此值从世界矩阵和视图矩阵实时计算而来，有一些性能消耗。**
   */
  get ndcPosition() {
    const {mainCamera} = this.getWorld();
    if (!mainCamera) {
      return null;
    }

    return this.absolutePosition.transformMat4(mainCamera.viewProjectionMatrix);
  }

  /**
   * 直接获取组件在本地空间的forward向量。
   */
  get forwardVector() {
    return new Math.Vector3(0, 0, 1).transformQuat(this.quaternion);
  }

  /**
   * 直接获取组件在本地空间的up向量。
   */
  get upVector() {
    return new Math.Vector3(0, 1, 0).transformQuat(this.quaternion);
  }

  /**
   * 直接获取组件在本地空间的right向量。
   */
  get rightVector() {
    return new Math.Vector3(1, 0, 0).transformQuat(this.quaternion);
  }

  /**
   * 直接获取组件在世界空间的forward向量。
   * 
   * **注意会先获取`absoluteRotation`，有一定开销！**
   */
  get worldForwardVector() {
    return new Math.Vector3(0, 0, 1).transformQuat(this.absoluteRotation);
  }

  /**
   * 直接获取组件在世界空间的up向量。
   * 
   * **注意会先获取`absoluteRotation`，有一定开销！**
   */
  get worldUpVector() {
    return new Math.Vector3(0, 1, 0).transformQuat(this.absoluteRotation);
  }

  /**
   * 直接获取组件在世界空间的right向量。
   * 
   * **注意会先获取`absoluteRotation`，有一定开销！**
   */
  get worldRightVector() {
    return new Math.Vector3(1, 0, 0).transformQuat(this.absoluteRotation);
  }

  /**
   * 直接获取组件的UP向量。
   * 
   * **注意这是一个可修改的值，如果没有特殊需求以防万一请用`upVector`！**
   */
  get up() {
    return this._node.up;
  }

  /**
   * 直接获取组件在**指定摄像机**下标准设备空间的位置数据。
   * 
   * **注意此值从世界矩阵和视图矩阵实时计算而来，有一些性能消耗。**
   */
  public getNdcPosition(camera: CameraComponent) {
    return this.absolutePosition.transformMat4(camera.viewProjectionMatrix);
  }

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit(initState?: IStateTypes) {
    this._node = new Hilo3d.Node();

    if (!initState) {
      return;
    }

    const initTransform = initState;

    if (initTransform.position) {
      this._node.position.copy(initTransform.position);
      delete initTransform['position'];
    }

    if (initTransform.rotation) {
      this._node.rotation.copy(initTransform.rotation);
      delete initTransform['rotation'];
    }

    if (initTransform.pivot) {
      this._node.pivot.copy(initTransform.pivot);
      delete initTransform['pivot'];
    }

    if (initTransform.quaternion) {
      this._node.quaternion.copy(initTransform.quaternion);
      delete initTransform['quaternion'];
    }

    if (initTransform.matrix) {
      this._node.matrix.copy(initTransform.matrix);
      delete initTransform['matrix'];
    }

    if (initTransform.visible !== undefined) {
      this._node.visible = initTransform.visible;
    }
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    if (this.needReleaseGlRes) {
      this._node.destroy(this.getGame().renderer, true);
    } else {
      this._node.removeFromParent();
    }
  }

  /**
   * 获取组件的的包围盒(AABB)信息。
   * @param bounds 当前计算的包围盒信息，可用于节省开销
   * @param currentMatrix 当前计算的矩阵，可用于节省开销
   */
  public getBounds(bounds?: Math.Bounds, currentMatrix?: Math.Matrix4) {
    return this._node.getBounds(null, currentMatrix, bounds);
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public addChild(component: SceneComponent) {
    this._children.add(component);
    component._parent = this;
    component._node.addTo(this._node);

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public removeChild(component: SceneComponent) {
    const index = this._children.indexOf(component);

    if (index < 0) {
      return;
    }

    component._parent = null;
    this._children.remove(index);

    return this;
  }

  /**
   * 设置本地空间位置数据。
   */
  public setPosition(x: number, y: number, z: number) {
    this._node.setPosition(x, y, z);

    return this;
  }

  /**
   * 设置本地空间旋转数据。
   */
  public setRotation(x: number, y: number, z: number) {
    this._node.setRotation(x, y, z);

    return this;
  }

  /**
   * 设置本地空间位移数据。
   */
  public setScale(x: number, y: number, z: number) {
    this._node.setScale(x, y, z);

    return this;
  }

  /**
   * 设置本地空间锚点数据。
   */
  public setPivot(x: number, y: number, z: number) {
    this._node.setPivot(x, y, z);

    return this;
  }

  /**
   * 设置本地空间四元数数据。
   */
  public setQuaternion(x: number, y: number, z: number, w: number) {
    this._node.quaternion.x = x;
    this._node.quaternion.y = y;
    this._node.quaternion.z = z;
    this._node.quaternion.w = w;

    return this;
  }

  /**
   * 设置世界空间位置数据。
   */
  public setAbsolutePosition(x: number, y: number, z: number) {
    this.absolutePosition = new Math.Vector3(x, y, z);

    return this;
  }

  /**
   * 沿着某个轴`axis`平移`distance`距离。
   */
  public translate(axis: Math.Vector3, distance: number) {
    tmpVec3.copy(axis).scale(distance);
    this.position.add(tmpVec3);
    // this.absolutePosition = this.absolutePosition.add(tmpVec3);

    return this;
  }

  /**
   * 绕着某个轴`axis`旋转`rad`弧度。
   */
  public rotate(axis: Math.Vector3, rad: number) {
    this._tmpQuat.setAxisAngle(axis, rad);
    this.quaternion.multiply(this._tmpQuat);

    return this;
  }

  /**
   * 更新当前实例以及子级组件的世界矩阵。
   */
  public updateMatrixWorld(force?: boolean) {
    let node = this._node;

    while (node) {
      if (node.parent && (node.parent as any).isStage) {
        node.updateMatrixWorld(force);
        break;
      }

      node = node.parent;
    }

    return this;
  }

  /**
   * 将自己从父级移除，基本等同于`destroy`方法，从Owner中销毁自身，同时递归移除所有子级组件。
   * 若父级也为`SceneComponent`，则会将自身从父级`children`中移除。
   */
  public removeFromParent() {
    if (!isSceneActor(this._parent)) {
      this._parent.removeChild(this);
    }

    this._owner.removeComponent(this);
    return this;
  }

  /**
   * 修改自身的朝向。
   */
  public lookAt(target: Math.Vector3 | ISceneActor | SceneComponent) {
    if (Math.isVector3(target)) {
      this._node.lookAt(target);

      return this;
    }

    if (isSceneActor(target)) {
      this._node.lookAt(target.transform.absolutePosition);

      return this;
    }

    this._node.lookAt(target.absolutePosition);
    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public cloneFromHiloNode(node: INodeWithGlTFExtensions) {
    (this._node as INodeWithGlTFExtensions).gltfExtensions = node.gltfExtensions;

    this._node.jointName = node.jointName;
    this._node.animationId = node.animationId;
  }

  /**
   * 可以自行重写用于添加预渲染策略！
   * 进行一次预渲染，期间会处理材质预编译、资源预提交等。
   */
  public preRender() {

  }
}
