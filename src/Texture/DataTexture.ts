/**
 * @File   : DataTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/22/2018, 5:24:21 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`DataTexture`。
 */
export function isDataTexture(value: any): value is DataTexture {
  return (value as DataTexture).isDataTexture;
}

export default class DataTexture extends Hilo3d.DataTexture {}
