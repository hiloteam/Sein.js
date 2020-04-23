/**
 * @File   : PBRMaterial.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:29:15 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Material from '../Material/Material';

/**
 * 判断一个实例是否为`PBRMaterial`。
 */
export function isPBRMaterial(value: Material): value is PBRMaterial {
  return (value as PBRMaterial).isPBRMaterial;
}

export default class PBRMaterial extends Hilo3d.PBRMaterial {}
