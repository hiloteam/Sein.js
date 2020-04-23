/**
 * @File   : BSPMorphComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 1:31:15 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import MorphGeometry from '../Geometry/MorphGeometry';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';
import BSPComponent, {IBSPComponentState} from '../BSP/BSPComponent';
import SObject from '../Core/SObject';
import GeometryData from '../Geometry/GeometryData';

/**
 * `BSPMorphComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IBSPMorphComponentState extends IBSPComponentState {
  /**
   * morph animation weights。
   */
  weights?: number[];
  /**
   * like:
   * {
   * vertices: [Target1GeometryData, Target2GeometryData, ...],
   * normals: [Target1GeometryData, Target2GeometryData, ...],
   * tangents: [Target1GeometryData, Target2GeometryData, ...]
   * }
   */
  targets?: {[attributes: string]: GeometryData[]};
}

/**
 * 判断一个实例是否为`BSPMorphComponent`。
 */
export function isBSPMorphComponent(value: SObject): value is BSPMorphComponent {
  return (value as BSPMorphComponent).isBSPMorphComponent;
}

/**
 * 判断一个实例是否为`BSPMorphActor`。
 */
export function isBSPMorphActor(value: SObject): value is SceneActor<any, BSPMorphComponent> {
  return isSceneActor(value) && isBSPMorphComponent(value.root);
}

/**
 * 基础Morph几何体。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPMorphComponent'})
export default class BSPMorphComponent extends BSPComponent<IBSPMorphComponentState> {
  public isBSPMorphComponent: boolean = true;

  /**
   * 获取几何体。
   */
  get geometry(): MorphGeometry {
    return this._mesh.geometry as MorphGeometry;
  }

  /**
   * 获取targets。
   */
  set targets(value: IBSPMorphComponentState['targets']) {
    this.geometry.targets = value as any;
  }

  /**
   * 设置targets。
   */
  get targets(): IBSPMorphComponentState['targets'] {
    return this.geometry.targets as any;
  }

  /**
   * 获取权重。
   */
  get weights(): IBSPMorphComponentState['weights'] {
    return this.geometry.weights;
  }

  /**
   * 设置权重。
   */
  set weights(value: IBSPMorphComponentState['weights']) {
    this.geometry.weights = value;
  }

  protected convertState(
    initState: IBSPMorphComponentState
  ): IStaticMeshComponentState {
    const {weights, targets, geometry, ...others} = initState;
    const result = others as IStaticMeshComponentState;

    const attrs = {};
    Object.keys(geometry).forEach(key => {
      if (geometry[key].isGeometryData) {
        attrs[key] = geometry[key];
      }
    });

    result.geometry = new MorphGeometry(attrs as any);

    if ((geometry as MorphGeometry).isMorphGeometry) {
      (result.geometry as any).targets = targets || (geometry as any).targets;
      (result.geometry as MorphGeometry).weights = weights || (geometry as MorphGeometry).weights.slice();
    } else {
      (result.geometry as MorphGeometry).weights = weights || [];
      (result.geometry as any).targets = targets || {};
    }

    return result;
  }
}
