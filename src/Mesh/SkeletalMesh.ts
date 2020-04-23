/**
 * @File   : SkeletalMesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/28/2018, 2:32:39 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Material from '../Material/Material';

/**
 * 判断一个实例是否为`SkeletalMesh`。
 */
export function isSkeletalMesh(value: any): value is SkeletalMesh {
  return (value as SkeletalMesh).isSkeletalMesh;
}

/**
 * 带有骨骼的曲面类。封装几何体`Geometry`和材质`Material`。
 */
export default class SkeletalMesh extends Hilo3d.SkinedMesh {
  public isSkeletalMesh: boolean = true;

  /**
   * 获取指定类型的材质。
   */
  public getMaterial<IMaterial extends Material>(): IMaterial {
    return this.material as IMaterial;
  }

  /**
   * 克隆。
   */
  public clone(isChild?: boolean): SkeletalMesh {
    return super.clone(isChild) as SkeletalMesh;
  }
}
