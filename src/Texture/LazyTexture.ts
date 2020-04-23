/**
 * @File   : LazyTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/22/2018, 5:24:39 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`LazyTexture`。
 */
export function isLazyTexture(value: any): value is LazyTexture {
  return (value as LazyTexture).isLazyTexture;
}

export default class LazyTexture extends Hilo3d.LazyTexture {}
