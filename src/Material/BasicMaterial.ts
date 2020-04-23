/**
 * @File   : BasicMaterial.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:28:43 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Material from '../Material/Material';
import Constants from '../Core/Constants';
import SName from '../Core/SName';
import {MetaSMaterials} from '../Core/MetaTypes';

/**
 * 判断一个实例是否为`BasicMaterial`。
 */
export function isBasicMaterial(value: Material): value is BasicMaterial {
  return (value as BasicMaterial).isBasicMaterial;
}

export default class BasicMaterial extends Hilo3d.BasicMaterial {}

/**
 * @hidden
 */
function GlTFBasicMaterial({
  uniforms,
  options,
  ...opts
}) {
  const lt = uniforms.lightType.value;
  const lightType: any = lt === 0 ? 'NONE' : lt === 1 ? 'PHONE' : lt === 2 ? 'BLINN-PHONE' : 'LAMBERT';

  return new BasicMaterial({
    lightType,
    diffuse: (uniforms.u_diffuseMap || uniforms.u_diffuse || {}).value,
    ambient: (uniforms.u_ambientMap || {}).value,
    specular: (uniforms.u_specularMap || uniforms.u_specular || {}).value,
    normalMap: (uniforms.u_normalMap || {}).value,
    normalMapScale: (uniforms.u_normalMapScale || {}).value,
    emission: (uniforms.u_emissionMap || uniforms.u_emission || {}).value,
    shininess: (uniforms.u_shininess || {}).value,
    reflectivity: (uniforms.u_reflectivity || {}).value,
    refractivity: (uniforms.u_refractivity || {}).value,
    refractRatio: (uniforms.u_refractRatio || {}).value,
    ...opts
  });
}

/**
 * @hidden
 */
(BasicMaterial as any).prototype.initCommonOptions = (options) => {
  if (options.alphaMode) {
    switch (options.alphaMode) {
      case 'BLEND':
        this.transparent = true;
        this.blend = true;
        break;
      case 'MASK':
        if ('alphaCutoff' in options) {
          this.alphaCutoff = options.alphaCutoff;
        } else {
          this.alphaCutoff = 0.5;
        }
        break;
      case 'OPAQUE':
      default:
        this.ignoreTranparent = true;
        break;
    }
  }

  if (options.doubleSided) {
    this.side = Constants.FRONT_AND_BACK;
  }
}

/**
 * @hidden
 */
(BasicMaterial as any).CLASS_NAME = new SName('BasicMaterial');

/**
 * @hidden
 */
MetaSMaterials['BasicMaterial'] = GlTFBasicMaterial as any;
