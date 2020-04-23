/**
 * @File   : Texture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/14/2018, 5:32:16 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * 判断一个实例是否为`Texture`。
 */
export function isTexture(value: any): value is Texture {
  return (value as Texture).isTexture;
}

export default class Texture extends Hilo3d.Texture {}
