/**
 * @File   : Mesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/28/2018, 2:32:15 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Material from '../Material/Material';

/**
 * 判断一个实例是否为`Mesh`。
 */
export function isMesh(value: any): value is Mesh {
  return (value as Mesh).isMesh;
}

/**
 * 曲面类。封装几何体`Geometry`和材质`Material`。
 */
export default class Mesh extends Hilo3d.Mesh {
  /**
   * 获取指定类型的材质。
   */
  public getMaterial<IMaterial extends Material>(): IMaterial {
    return this.material as IMaterial;
  }

  /**
   * 克隆。
   */
  public clone(isChild?: boolean): Mesh {
    return super.clone(isChild) as Mesh;
  }
}
