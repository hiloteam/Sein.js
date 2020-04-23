/**
 * @File   : GeometryData.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/13/2018, 2:47:53 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`GeometryData`。
 */
export function isGeometryData(value: any): value is GeometryData {
  return (value as GeometryData).isGeometryData;
}

export default class GeometryData extends Hilo3d.GeometryData {
  constructor(data: Float32Array | Uint8Array | Uint16Array | Uint8ClampedArray | Float64Array, size: number, params?: Object) {
    super(data, size, params);
  }
}
