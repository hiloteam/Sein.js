/**
 * @File   : BoxGeometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:33:54 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Geometry from '../Geometry/Geometry';

/**
 * 判断一个实例是否为`BoxGeometry`。
 */
export function isBoxGeometry(value: Geometry): value is BoxGeometry {
  return (value as BoxGeometry).isBoxGeometry;
}

export default class BoxGeometry extends Hilo3d.BoxGeometry {}
