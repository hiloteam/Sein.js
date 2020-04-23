/**
 * @File   : Geometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:32:21 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`Geometry`。
 */
export function isGeometry(value: any): value is Geometry {
  return (value as Geometry).isGeometry;
}

export default class Geometry extends Hilo3d.Geometry {}
