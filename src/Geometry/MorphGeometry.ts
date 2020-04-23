/**
 * @File   : MorphGeometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:34:18 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Geometry from '../Geometry/Geometry';

/**
 * 判断一个实例是否为`MorphGeometry`。
 */
export function isMorphGeometry(value: Geometry): value is MorphGeometry {
  return (value as MorphGeometry).isMorphGeometry;
}

export default class MorphGeometry extends Hilo3d.MorphGeometry {}
