/**
 * @File   : GeometryMaterial.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:28:23 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Material from '../Material/Material';

export function isGeometryMaterial(value: Material): value is GeometryMaterial {
  return (value as GeometryMaterial).isGeometryMaterial;
}

export default class GeometryMaterial extends Hilo3d.GeometryMaterial {}
