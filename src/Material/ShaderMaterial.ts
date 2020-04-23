/**
 * @File   : ShaderMaterial.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 10:28:32 PM
 * @Description:
 */
import RawShaderMaterial, {IShaderMaterialOptions} from './RawShaderMaterial';
import BasicDefinitionChunk from '../Material/shaderChunks/BasicDefinitionChunk';
import Material from '../Material/Material';
import {SMaterial} from '../Core/Decorator';

/**
 * 判断一个实例是否为`ShaderMaterial`。
 */
export function isShaderMaterial(value: Material): value is ShaderMaterial {
  return (value as ShaderMaterial).isShaderMaterial;
}

/**
 * 自定义材质类，在`RawShaderMaterial`基础上增加了基本的`attributes`和`uniforms`定义。
 * 基础的定义请见[BasicDefinitionChunk](../basicdefinitionchunk)
 * 
 * @noInheritDoc
 */
@SMaterial({className: 'ShaderMaterial'})
export default class ShaderMaterial extends RawShaderMaterial {
  public isShaderMaterial = true;

  constructor(options: IShaderMaterialOptions) {
    super();
    options.chunks = options.chunks || [];
    options.chunks.splice(0, 0, new BasicDefinitionChunk('basicDefinition'));

    this.init(options);
  }
}
