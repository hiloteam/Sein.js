/**
 * @File   : PerspectiveCameraComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/11/2018, 11:06:01 AM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {SClass} from '../Core/Decorator';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import CameraComponent, {ICameraState} from '../Camera/CameraComponent';
import {Vector3} from '../Core/Math';
import {ISceneComponentState} from '../Renderer/SceneComponent';
import SObject from '../Core/SObject';

/**
 * `PerspectiveCameraComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IPerspectiveCameraComponentState extends ICameraState {
  /**
   * 摄像机俯仰角。
   */
  fov: number;
  /**
   * 摄像机视场纵横比。
   */
  aspect: number;
  /**
   * 摄像机近裁剪面。
   */
  near: number;
  /**
   * 摄像机远裁剪面。
   */
  far: number;
}

/**
 * 判断一个实例是否为`PerspectiveCameraComponent`。
 */
export function isPerspectiveCameraComponent(value: SObject): value is PerspectiveCameraComponent {
  return (value as PerspectiveCameraComponent).isPerspectiveCameraComponent;
}

/**
 * 判断一个实例是否为`PerspectiveCameraActor`。
 */
export function isPerspectiveCameraActor(value: SObject): value is SceneActor<any, PerspectiveCameraComponent> {
  return isSceneActor(value) && isPerspectiveCameraComponent(value.root);
}

/**
 * 透视摄像机组件。
 * 
 * @noInheritDoc
 */
@SClass({className: 'PerspectiveCameraComponent'})
export default class PerspectiveCameraComponent<
IStateTypes extends IPerspectiveCameraComponentState = IPerspectiveCameraComponentState
> extends CameraComponent<IStateTypes> {
  public isPerspectiveCameraComponent: boolean = true;

  protected _camera: Hilo3d.PerspectiveCamera;

  protected onCreateCamera(initState: Partial<IStateTypes>) {
    return new Hilo3d.PerspectiveCamera(initState);
  }

  /**
   * 摄像机近裁剪面。
   */
  set near(near: number) {
    this._camera.near = near;
  }

  /**
   * 摄像机近裁剪面。
   */
  get near() {
    return this._camera.near;
  }

  /**
   * 摄像机远裁剪面。
   */
  set far(far: number) {
    this._camera.far = far;
  }

  /**
   * 摄像机远裁剪面。
   */
  get far() {
    return this._camera.far;
  }

  /**
   * 摄像机俯仰角。
   */
  set fov(fov: number) {
    this._camera.fov = fov;
  }

  /**
   * 摄像机俯仰角。
   */
  get fov() {
    return this._camera.fov;
  }

  /**
   * 摄像机视场纵横比。
   */
  set aspect(aspect: number) {
    this._camera.aspect = aspect;
  }

  /**
   * 摄像机视场纵横比。
   */
  get aspect() {
    return this._camera.aspect;
  }

  /**
   * 根据容器上的一个点`(x, y)`以及容器的宽度`width`和高度`height`，还有射线长度`rayLength`生成世界空间的一条射线。
   * 射线起点和终点将会被存储到传入的`outFrom`和`outTo`中。
   */
  public generateRay(
    x: number,
    y: number,
    width: number,
    height: number,
    outFrom: Vector3,
    outTo: Vector3,
    rayLength: number = 100
  ) {
    this._node.worldMatrix.getTranslation(outFrom);

    outTo.set(x, y, 1);
    outTo.copy(this._camera.unprojectVector(outTo, width, height).subtract(outFrom)).normalize().scale(rayLength).add(outFrom);

    return this;
  }
}
