/**
 * @File   : SphereGeometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:34:10 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Geometry from '../Geometry/Geometry';

/**
 * 判断一个实例是否为`SphereGeometry`。
 */
export function isSphereGeometry(value: Geometry): value is SphereGeometry {
  return (value as SphereGeometry).isSphereGeometry;
}

export default class SphereGeometry extends Hilo3d.SphereGeometry {}
