/**
 * @File   : CameraComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/14/2018, 11:15:54 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SceneComponent, {ISceneComponentState} from '../Renderer/SceneComponent';
import throwException from '../Exception/throwException';
import {Vector3, Color, Matrix4} from '../Core/Math';
import Hilo3d from '../Core/Hilo3d';
import SObject from '../Core/SObject';
import FrameBuffer from '../Renderer/FrameBuffer';
import SkyboxMaterial from '../Material/SkyboxMaterial';
import Mesh from '../Mesh/Mesh';
import BoxGeometry from '../Geometry/BoxGeometry';
import SphereGeometry from '../Geometry/SphereGeometry';
import BreakGuardException from '../Exception/BreakGuardException';

/**
 * 判断一个实例是否为`CameraComponent`。
 */
export function isCameraComponent(value: SObject): value is CameraComponent {
  return (value as CameraComponent).isCameraComponent;
}

/**
 * 判断一个实例是否为`CameraActor`。
 */
export function isCameraActor(value: SObject): value is SceneActor<any, CameraComponent> {
  return isSceneActor(value) && isCameraComponent(value.root);
}

/**
 * 摄像机组件的初始化类型接口。
 */
export interface ICameraState extends ISceneComponentState {
  /**
   * 天空盒纹理。
   */
  backgroundMat?: SkyboxMaterial;
}

/**
 * 摄像机Component基类，承担着场景摄像机的实际功能。
 * 一般不直接使用，而是使用各个派生类。
 * 
 * @noInheritDoc
 */
@SClass({className: 'CameraComponent'})
export default class CameraComponent<IStateTypes extends ICameraState = ICameraState> extends SceneComponent<IStateTypes> {
  public isCameraComponent: boolean = true;

  protected _owner: SceneActor;
  protected _isMainCamera: boolean = false;
  protected _camera: Hilo3d.Camera;
  protected _rendererAlive: boolean = false;
  protected _background: Mesh;
  protected _backgroundMat: SkyboxMaterial;

  /**
   * 是否为当前World的主摄像机。
   */
  get isMainCamera() {
    return this._isMainCamera;
  }

  /**
   * 视图矩阵。
   */
  get viewMatrix() {
    return this._camera.viewMatrix;
  }

  /**
   * 投影矩阵。
   */
  get projectionMatrix() {
    return this._camera.projectionMatrix;
  }

  /**
   * 视图投影矩阵。
   */
  get viewProjectionMatrix() {
    return this._camera.viewProjectionMatrix;
  }

  /**
   * 渲染器是否在正常活动。
   */
  get rendererAlive() {
    return this._rendererAlive;
  }

  /**
   * 修改天空盒材质。
   */
  public changeBackgroundMat(action: (mat: SkyboxMaterial) => void) {
    const preType = this._backgroundMat.type;
    action(this._backgroundMat);
    
    if (preType !== this._backgroundMat.type) {
      this.generateSkybox(this._backgroundMat);

      if (this._isMainCamera) {
        this.disableSkybox();
        this.enableSkybox();
      }
    }
  }

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit(initState: IStateTypes) {
    super.onInit(initState);

    this._camera = this.onCreateCamera(initState);
    (this._camera as any).__forceUseParentWorldMatrix = true;
    this._node.addChild(this._camera);
    (this._node as any)._rotation.order = 'XYZ';
    (this._node as any).isCamera = true;
    this.generateSkybox(initState.backgroundMat);
  }

  protected generateSkybox(mat: SkyboxMaterial) {
    if (!mat) {
      mat = new SkyboxMaterial({type: 'Color', uniforms: {
        u_color: {value: this.getGame().renderer.clearColor}
      }});
    }

    if (mat.type === 'Color') {
      this.getGame().renderer.clearColor.copy(mat.getUniform<Color>('u_color').value);
      return;
    }

    this._backgroundMat = mat;

    if (mat.type === 'Panoramic') {
      this._background = new Mesh({
        geometry: new SphereGeometry({radius: 1}),
        material: this._backgroundMat
      });
    } else {
      this._background = new Mesh({
        geometry: new BoxGeometry({width: 2, height: 2, depth: 2}),
        material: this._backgroundMat
      });
    }

    this._background.frustumTest = false;
  }

  protected onCreateCamera(initState: Partial<IStateTypes>): Hilo3d.Camera {
    return null;
  }

  /**
   * 特殊生命周期，当摄像机被作为World的主摄像机时被触发。
   */
  public onAsMainCamera(isMain: boolean) {
    const game = this.getGame();

    if (isMain) {
      this.enableSkybox();
      game.hiloStage.camera = this._camera;
      this._isMainCamera = true;
    } else if (this._isMainCamera) {
      this.disableSkybox();
      game.hiloStage.camera = null;
      this._isMainCamera = false;
    }
  }

  protected enableSkybox() {
    if (this._background) {
      this.getGame().hiloStage.addChild(this._background);
    }
  }

  protected disableSkybox() {
    if (this._background) {
      this.getGame().hiloStage.removeChild(this._background);
    }
  }

  /**
   * 加入World，继承请先`super.onAdd()`。
   */
  public onAdd() {
    if (!this.getWorld().mainCamera) {
      this.getWorld().setMainCamera(this);
    }
  }

  /**
   * 每一帧更新，继承请先`super.onUpdate()`。
   */
  public onUpdate() {
    this._rendererAlive = false;

    if (this._isMainCamera && this._background) {
      this._backgroundMat.changeUniform<Matrix4>('u_viewProjectionMatrix', mat => {
        mat.copy(this.viewMatrix);
        const rotation = this._backgroundMat.getUniform<number>('u_rotation');
        if (rotation && rotation.value !== 0) {
          mat.rotateY(-rotation.value);
        }

        mat.elements[12] = 0;
        mat.elements[13] = 0;
        mat.elements[14] = 0;
        
        mat.premultiply(this.projectionMatrix);

        return mat;
      });
    }
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    this.onAsMainCamera(false);

    if (this.getWorld().mainCamera === this) {
      this.getWorld().removeMainCamera();
    }

    super.onDestroy();
  }

  /**
   * 计算向量`vector`从世界空间被该相机投影到二维画布上的位置。
   * 若不传容器的`width`和`height`，则返回`0 ~ 1`的值。
   */
  public projectVector(vector: Vector3, width?: number, height?: number) {
    return this._camera.projectVector(vector, width, height);
  }

  /**
   * 计算向量`vector`从屏幕空间反变换到世界空间后的位置。
   * 若不传容器的`width`和`height`，则认为`vector`是NDC的坐标。
   */
  public unprojectVector(vector: Vector3, width?: number, height?: number) {
    return this._camera.unprojectVector(vector, width, height);
  }

  /**
   * 更新视图投影矩阵
   */
  public updateViewProjectionMatrix() {
    this._camera.updateProjectionMatrix();
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
  ): void {
    throw new Error('Not implements');
  }

  /**
   * 截取当前画布并返回Blob或Base64。
   * 但注意其开销！其会**立即再渲染一遍当前场景**！
   * 
   * @param mimetype 编码类型，例如image/jpeg
   * @param encoderOptions 编码参数，0 ~ 1。
   */
  public async captureScreen<TMode extends 'blob' | 'base64'>(
    mode: TMode,
    mimetype?: string,
    encoderOptions?: number
  ): Promise<{blob: Blob; base64: string}[TMode]>  {
    if (!this._isMainCamera) {
      throw new BreakGuardException(this, '`captureScreen` can not be called by `mainCamera` now !')
    }

    const {canvas} = this.getGame();

    return new Promise((resolve, reject) => {
      this.render();

      try {
        if (mode === 'blob') {
          canvas.toBlob((blob: Blob) => resolve(blob as any), mimetype, encoderOptions);
        } else {
          resolve(canvas.toDataURL(mimetype, encoderOptions) as any);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 渲染当前摄像机对应的画面。如果没有特殊需求（比如后处理、镜面等）不需要自己调用。
   * 
   * @param frameBuffer 如果指定，则将会渲染到这个FrameBuffer，不会输出到屏幕上。
   * @param fireEvent 开发者无需关心，**不要自己使用！**。
   */
  public render(frameBuffer?: FrameBuffer, fireEvent: boolean = false) {
    const game = this.getGame();
    const world = this.getWorld();
    const {renderer} = game;

    if (this._isMainCamera && fireEvent) {
      game.event.trigger('MainRendererWillStart');
    }

    if (!this._isMainCamera) {
      game.hiloStage.camera = this._camera;
    }

    if (world.enableLayers) {
      world.actors.forEach(actor => {
        actor.visible = this.layers.test(actor.layers);
      });
    }

    try {
      if (frameBuffer) {
        frameBuffer.bind();
        renderer.render(game.hiloStage, this._camera, false);
        frameBuffer.unbind();
      } else {
        renderer.render(game.hiloStage, this._camera, fireEvent);
      }
      this._rendererAlive = true;
    } catch (error) {
      throwException(error, this);
      this._rendererAlive = false;
    }

    if (!this._isMainCamera) {
      game.hiloStage.camera = world.mainCamera._camera;
    }

    if (this._isMainCamera && fireEvent) {
      game.event.trigger('MainRendererIsFinished');
    }
  }
}
