/**
 * @File   : OrthographicCameraComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/11/2018, 11:05:01 AM
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
 * `OrthographicCameraComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IOrthographicCameraComponentState extends ICameraState {
  /**
   * 摄像机左裁剪面。
   */
  left: number;
  /**
   * 摄像机右裁剪面。
   */
  right: number;
  /**
   * 摄像机下裁剪面。
   */
  bottom: number;
  /**
   * 摄像机上裁剪面。
   */
  top: number;
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
 * 判断一个实例是否为`OrthographicCameraComponent`。
 */
export function isOrthographicCameraComponent(value: SObject): value is OrthographicCameraComponent {
  return (value as OrthographicCameraComponent).isOrthographicCameraComponent;
}

/**
 * 判断一个实例是否为`OrthographicCameraActor`。
 */
export function isOrthographicCameraActor(value: SObject): value is SceneActor<any, OrthographicCameraComponent> {
  return isSceneActor(value) && isOrthographicCameraComponent(value.root);
}

/**
 * 正交摄像机组件。
 * 
 * @noInheritDoc
 */
@SClass({className: 'OrthographicCameraComponent'})
export default class OrthographicCameraComponent<
  IStateTypes extends IOrthographicCameraComponentState = IOrthographicCameraComponentState
> extends CameraComponent<IStateTypes> {
  public isOrthographicCameraComponent: boolean = true;

  protected _camera: Hilo3d.OrthographicCamera;

  protected onCreateCamera(initState: IStateTypes) {
    return new Hilo3d.OrthographicCamera(initState);
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
   * 摄像机左裁剪面。
   */
  set left(left: number) {
    this._camera.left = left;
  }

  /**
   * 摄像机左裁剪面。
   */
  get left() {
    return this._camera.left;
  }

  /**
   * 摄像机右裁剪面。
   */
  set right(right: number) {
    this._camera.right = right;
  }

  /**
   * 摄像机右裁剪面。
   */
  get right() {
    return this._camera.right;
  }

  /**
   * 摄像机上裁剪面。
   */
  set top(top: number) {
    this._camera.top = top;
  }

  /**
   * 摄像机上裁剪面。
   */
  get top() {
    return this._camera.top;
  }

  /**
   * 摄像机下裁剪面。
   */
  set bottom(bottom: number) {
    this._camera.bottom = bottom;
  }

  /**
   * 摄像机下裁剪面。
   */
  get bottom() {
    return this._camera.bottom;
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
    const camera = this._camera;
    outFrom.set(x, y, (camera.near + camera.far) / (camera.near - camera.far));
    outFrom.copy(this._camera.unprojectVector(outFrom, width, height));

    const {forwardVector} = this;
    outTo.copy(outFrom).add(forwardVector.scale(-rayLength));

    return this;
  }
}
