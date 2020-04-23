/**
 * @File   : Fog.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/10/2019, 3:59:30 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`Fog`。
 */
export function isFog(value: any): value is Fog {
  return (value as Fog).isFog;
}

export default class Fog extends Hilo3d.Fog {}
