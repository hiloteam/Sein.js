/**
 * @File   : PlaneGeometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:34:03 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Geometry from '../Geometry/Geometry';

/**
 * 判断一个实例是否为`PlaneGeometry`。
 */
export function isPlaneGeometry(value: Geometry): value is PlaneGeometry {
  return (value as PlaneGeometry).isPlaneGeometry;
}

export default class PlaneGeometry extends Hilo3d.PlaneGeometry {}
