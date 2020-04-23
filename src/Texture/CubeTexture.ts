/**
 * @File   : CubeTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/22/2018, 5:25:01 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`CubeTexture`。
 */
export function isCubeTexture(value: any): value is CubeTexture {
  return (value as CubeTexture).isCubeTexture;
}

export default class CubeTexture extends Hilo3d.CubeTexture {}
