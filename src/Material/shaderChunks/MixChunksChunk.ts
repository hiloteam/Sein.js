/**
 * @File   : MixChunksChunk.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/20/2018, 4:45:23 PM
 * @Description:
 */
import ShaderChunk from '../../Material/ShaderChunk';

/**
 * `MixChunksChunk`的初始化参数类型。
 */
export interface IMixChunksChunkOptions {
  /**
   * 要混合的chucks。
   */
  chunks: ShaderChunk[];
  /**
   * 根据每个chuck的名字，来指定顶点着色器输出各自的权重。
   */
  vsWeights?: {[name: string]: number};
  /**
   * 根据每个chuck的名字，来指定片段着色器输出各自的权重。
   */
  fsWeights?: {[name: string]: number};
}

/**
 * 混合多个chuck的chuck，可以作为一个材质最终的输出。
 * 
 * @noInheritDoc
 */
export default class MixChunksChunk extends ShaderChunk<IMixChunksChunkOptions> {
  public hasVsOut: boolean = true;
  public hasFsOut: boolean = true;

  public onInit(name: string, options: IMixChunksChunkOptions) {
    const {chunks, vsWeights = {}, fsWeights = {}} = options;
    const vsRes: string[] = [];
    const fsRes: string[] = [];

    if (name) {
      this.vsEntryName = this.fsEntryName = name;
    } else {
      this.vsEntryName = this.fsEntryName = 'mixChunks';
    }

    this.vs.main = this.fs.main = `vec4 ${this.vsEntryName}() {\n`;

    const length = options.chunks.length;
    for (let index = 0; index < length; index += 1) {
      const chuck = chunks[index];
      if (chuck.vsEntryName) {
        if (chuck.hasVsOut) {
          const weight = vsWeights[chuck.name] || 0;
          const weightName = `u_${chuck.vsEntryName}VsWeight`;
          const resName = `${chuck.vsEntryName}Res`;

          vsRes.push(resName);
          this.vs.main += `vec4 ${resName} = ${chuck.vsEntryName}() * ${weightName};\n`;
          this.uniforms[weightName] = {value: weight};
          this.vs.header += `uniform float ${weightName};\n`;
        } else {
          this.vs.main += `${chuck.vsEntryName}();\n`;
        }
      }

      if (chuck.fsEntryName) {
        if (chuck.hasFsOut) {
          const weight = fsWeights[chuck.name] || 0;
          const weightName = `u_${chuck.fsEntryName}FsWeight`;
          const resName = `${chuck.fsEntryName}Res`;

          fsRes.push(resName);
          this.fs.main += `vec4 ${resName} = ${chuck.fsEntryName}() * ${weightName};\n`;
          this.uniforms[weightName] = {value: weight};
          this.fs.header += `uniform float ${weightName};\n`;
        } else {
          this.fs.main += `${chuck.fsEntryName}();\n`;
        }
      }
    }

    this.vs.main += 'return ' + vsRes.join(' + ') + ';\n}';
    this.fs.main += 'return ' + fsRes.join(' + ') + ';\n}';
  }
}
