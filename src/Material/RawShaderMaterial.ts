/**
 * @File   : RawShaderMaterial.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/20/2018, 2:32:27 PM
 * @Description:
 */
import ShaderChunk, {IShaderChunkCode, IMaterialUniform, IMaterialAttribute} from '../Material/ShaderChunk';
import {IShaderChunk} from './ShaderChunk';
import {IMaterial} from '../Material/Material';
import Hilo3d from '../Core/Hilo3d';
import Debug from '../Debug';
import Material from '../Material/Material';
import Constants from '../Core/Constants';
import {isTexture} from '../Texture/Texture';
import SName from '../Core/SName';
import {SMaterial} from '../Core/Decorator';

/**
 * `RawShaderMaterial`的初始化参数类型。
 */
export interface IShaderMaterialOptions<
  TExtraUniformSemantic extends string = '',
  TExtraAttributeSemantic extends string = ''
> extends IMaterial {
  /**
   * 需要添加的`chucks`，可利用其进行材质复用，详见[ShaderChuck](../shaderchuck)。
   */
  chunks?: ShaderChunk[];
  /**
   * 材质的attributes属性。
   */
  attributes?: IShaderChunk<TExtraUniformSemantic, TExtraAttributeSemantic>['attributes'];
  /**
   * 材质的uniform属性。
   */
  uniforms?: IShaderChunk<TExtraUniformSemantic, TExtraAttributeSemantic>['uniforms'];
  /**
   * 材质两个着色器共有的宏，将会添加到两个着色器的开头。
   */
  defines?: IShaderChunk['defines'];
  /**
   * 材质的顶点着色器。
   */
  vs?: string | IShaderChunkCode;
  /**
   * 材质的片段着色器。
   */
  fs?: string | IShaderChunkCode;
  /**
   * 材质的混合模式。
   * 
   * @default 'OPAQUE'
   */
  alphaMode?: 'BLEND' | 'MASK' | 'OPAQUE';
  /**
   * 材质是否属双向可见的，若是，则会关闭背面剔除。
   * 
   * @default false
   */
  doubleSided?: boolean;
  /**
   * 材质是否无光照，一般无需关心。
   * 
   * @todo: 配合KHR_materials_unlit使用。
   * 
   * @default false
   */
  unlit?: boolean;
  /**
   * 材质ID，用于材质复用。一般而言若使用了`SMaterial`装饰器标注材质，不用特别指定此，引擎会自动处理。
   */
  id?: string;
}

/**
 * @hidden
 */
function isIMaterialUniform(value: any): value is IMaterialUniform {
  return value && !(value as string).substr && 'value' in (value as IMaterialUniform);
}

/**
 * @hidden
 */
function isIMaterialAttribute(value: any): value is IMaterialAttribute {
  return (value as IMaterialAttribute).name !== undefined;
}

/**
 * @hidden
 */
function isNumber(value: any): value is number {
  return !!(value as number).toPrecision;
}

/**
 * @hidden
 */
function isNumberArray(value: any): value is number[] {
  return !!(value as number[]).push;
}

/**
 * @hidden
 */
function isString(value: any): value is string {
  return !!(value as string).toLowerCase;
}

/**
 * 判断一个实例是否为`RawShaderMaterial`。
 */
export function isRawShaderMaterial(value: Material): value is RawShaderMaterial {
  return (value as RawShaderMaterial).isRawShaderMaterial;
}

/**
 * 纯净的自定义材质类，允许你创建属于自己的Shader材质。
 * 
 * @noInheritDoc
 */
@SMaterial({className: 'RawShaderMaterial'})
export default class RawShaderMaterial<
  TExtraUniformSemantic extends string = '',
  TExtraAttributeSemantic extends string = ''
> extends Hilo3d.ShaderMaterial {
  /**
   * 类名。
   */
  public static CLASS_NAME: SName = new SName('RawShaderMaterial');

  public isRawShaderMaterial = true;
  /**
   * 类名。
   */
  public className = 'RawShaderMaterial';
  /**
   * 当材质作为模型中的自定义材质时，每次创建一个新模型实例时是否要对材质进行`clone`。
   * 这通常用于可能有多个实例的、具有材质动画的模型。
   */
  public cloneForInst: boolean = false;
  /**
   * @hidden
   */
  public vs: string;
  /**
   * @hidden
   */
  public fs: string;

  protected _initOptions: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>;
  protected _mainVsChunkName: string;
  protected _mainFsChunkName: string;
  protected _chuckDefines: string[] = [];
  protected _chuckVs: IShaderChunkCode[] = [];
  protected _chuckFs: IShaderChunkCode[] = [];
  protected _uniforms: {[name: string]: IMaterialUniform} = {};
  /**
   * **高级材质属性，一般而言不要直接修改或者读取它。**
   * 通过getUniforms方法或者getUniform方法获取或修改！
   * 或通过setUniform方法修改！
   */
  public uniforms: any;

  constructor(options?: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    super({useHeaderCache: true});
    this._initOptions = options;

    if (!options) {
      return;
    }

    this.className = (this.constructor as typeof RawShaderMaterial).CLASS_NAME.value;

    options.shaderCacheId = options.id;
    if (!options.id && this.className !== 'RawShaderMaterial' && this.className !== 'ShaderMaterial') {
      options.shaderCacheId = this.className;
    }
    delete options.id;

    this.init(options);
  }

  /**
   * 获取特定的Uniform实例引用，可以获取后直接用`value`来设置它。
   */
  public getUniform<TValue extends IMaterialUniform['value'] = any>(key: string): {value: TValue} {
    return this._uniforms[key] as {value: TValue};
  }

  /**
   * 直接设置某个特定uniform的`value`。
   */
  public setUniform<TValue extends IMaterialUniform['value'] = any>(key: string, value: TValue) {
    const uniform = this._uniforms[key];

    if (!uniform || uniform.value === null || uniform.value === undefined) {
      this.initUniform(key, {value});
      return this;
    }

    uniform.value = value;

    return this;
  }

  /**
   * 通过一个回调函数以及其传入的uniform当前值，设置某个特定uniform的`value`。
   */
  public changeUniform<TValue extends IMaterialUniform['value'] = any>(key: string, handler: (value: TValue) => TValue) {
    const value = handler(this._uniforms[key].value as TValue);

    return this.setUniform(key, value);
  }

  protected init(options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    if (!options.id) {
      delete options.id;
    }

    // default blend mode
    this.blendSrc = Constants.SRC_ALPHA;
    this.blendDst = Constants.ONE_MINUS_SRC_ALPHA;
    this.blendEquationAlpha = Constants.FUNC_ADD;

    Object.assign(this, options);

    this.uniforms = {};
    this.attributes = {};
    this.vs = '';
    this.fs = '';

    this.initChunks(options);
    this.initAttributes(options);
    this.initUniforms(options);
    this.initShaders(options);
  }

  protected initChunks(options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    options.attributes = options.attributes || {};
    options.uniforms = options.uniforms || {};

    if (options.chunks) {
      const length = options.chunks.length;

      for (let index = 0; index < length; index += 1) {
        const chuck = options.chunks[index];

        if (Debug.devMode) {
          this.checkChuck(chuck, options);
        }

        Object.assign(options.attributes, chuck.attributes);
        Object.assign(options.uniforms, chuck.uniforms);
        if (chuck.vs) {
          this._chuckVs.push(chuck.vs);

          if (chuck.isMain && chuck.hasVsOut) {
            this._mainVsChunkName = chuck.vsEntryName;
          }
        }

        if (chuck.fs) {
          this._chuckFs.push(chuck.fs);

          if (chuck.isMain && chuck.hasFsOut) {
            this._mainFsChunkName = chuck.fsEntryName;
          }
        }

        if (chuck.defines) {
          this._chuckDefines.push(chuck.defines);
        }
      }
    }

    if (options.vs) {
      if (isString(options.vs)) {
        this._chuckVs.push({main: options.vs, header: ''});
      } else {
        this._chuckVs.push(options.vs);
      }
      this._mainVsChunkName = '';
    }

    if (options.fs) {
      if (isString(options.fs)) {
        this._chuckFs.push({main: options.fs, header: ''});
      } else if (options.fs) {
        this._chuckFs.push(options.fs);
      }
      this._mainFsChunkName = '';
    }

    if (options.defines) {
      this._chuckDefines.push(options.defines);
    }
  }

  protected checkChuck(chuck: ShaderChunk, options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    const {
      requiredUniforms, requiredAttributes,
      uniforms, attributes
    } = chuck;

    // check requiredAttributes
    for (const key of requiredAttributes) {
      if (!options.attributes[key]) {
        throw new Error(`Shader chuck "${chuck.name}" requires attribute "${key}" !`);
      }
    }

    // check requiredUniforms
    for (const key of requiredUniforms) {
      if (!options.uniforms[key]) {
        throw new Error(`Shader chuck "${chuck.name}" requires uniform "${key}" !`);
      }
    }

    // check conflict
    for (const key in attributes) {
      if (options.attributes[key]) {
        throw new Error(`Attribute "${key}" is already existed, re-defined in shader chuck "${chuck.name}" !`);
      }
    }

    for (const key in uniforms) {
      if (options.uniforms[key]) {
        throw new Error(`Uniform "${key}" is already existed, re-defined in shader chuck "${chuck.name}" !`);
      }
    }
  }

  protected initAttributes(options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    const {attributes} = options;
    this.attributes = {};
    for (const key in attributes) {
      const attribute = attributes[key];
      if (!isIMaterialAttribute(attribute)) {
        this.attributes[key] = attribute;
      } else {
        this.attributes[key] = {
          get: mesh => mesh.geometry[attribute.name]
        };
      }
    }
  }

  protected initUniforms(options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    const {uniforms} = options;

    if (!uniforms['u_gammaFactor']) {
      uniforms['u_gammaFactor'] = 'GAMMAFACTOR';
    }

    if (!uniforms['u_exposure']) {
      uniforms['u_exposure'] = 'EXPOSURE';
    }

    for (const key in uniforms) {
      const uniform = uniforms[key];

      if (!isIMaterialUniform(uniform)) {
        this.uniforms[key] = uniform;
        continue;
      }

      this.initUniform(key, uniform);
    }
  }

  protected initUniform(key: string, uniform: IMaterialUniform) {
    const {_uniforms} = this;
    if (uniform.isGlobal) {
      _uniforms[key] = uniform;
    } else {
      _uniforms[key] = {value: uniform.value};
    }

    const {value} = _uniforms[key];

    this.isDirty = true;

    if (value === null || value === undefined) {
      this.uniforms[key] = {
        get() {
          return null;
        }
      };
      return;
    }

    if (isTexture(value)) {
      this.uniforms[key] = {
        get(_, __, programInfo) {
          return (Hilo3d.semantic as any).handlerTexture(_uniforms[key].value, programInfo.textureIndex);
        }
      };
      return;
    }

    if (isNumber(value) || isNumberArray(value)) {
      this.uniforms[key] = {
        get() {
          return _uniforms[key].value;
        }
      };
      return;
    }

    this.uniforms[key] = {
      get() {
        return (_uniforms[key].value as any).elements;
      }
    };
  }

  protected initShaders(options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>) {
    const definesChuck = this._chuckDefines.join('\n') + '\n';
    this.vs += definesChuck;
    this.fs += definesChuck;

    this.vs += this.generateShader(this._chuckVs);
    this.fs += this.generateShader(this._chuckFs);

    if (this._mainVsChunkName) {
      this.vs += `
void main() {
  gl_Position = ${this._mainVsChunkName}();
}
      `;
    }

    if (this._mainFsChunkName) {
      this.fs += `
void main() {
  gl_FragColor = ${this._mainFsChunkName}();
}
      `;
    }

    this.initCommonOptions(options);
  }

  /**
   * 不需要自己使用！
   * 
   * @hidden
   */
  public initCommonOptions(options: IShaderMaterialOptions<TExtraUniformSemantic, TExtraAttributeSemantic>, fromLoader: boolean = false) {
    if (options.alphaMode && (!fromLoader || !this._initOptions.alphaMode)) {
      switch (options.alphaMode) {
        case 'BLEND':
          this.transparent = true;
          this.blend = true;
          if (!fromLoader) {
            this.blendSrc = options.blendSrc || Constants.SRC_ALPHA;
            this.blendDst = options.blendDst || Constants.ONE_MINUS_SRC_ALPHA;
            this.blendEquationAlpha = options.blendEquationAlpha || Constants.FUNC_ADD;
          }
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

      this._initOptions.alphaMode = options.alphaMode;
    }

    if ((options.doubleSided && !fromLoader) || (options.doubleSided && !this._initOptions.doubleSided)) {
      this.side = Constants.FRONT_AND_BACK;
      this._initOptions.doubleSided = true;
    }

    (this as any).lightType = options.unlit ? 'NONE' : 'ENABLE';
  }

  private generateShader(chucks: IShaderChunkCode[]) {
    let headerCode = '';
    let mainCode = '';
    const length = chucks.length;

    for (let index = 0; index < length; index += 1) {
      const {header, main} = chucks[index];
      headerCode += header + '\n';
      mainCode += main + '\n';
    }

    return headerCode + '\n' + mainCode + '\n';
  }

  /**
   * 获取定制的渲染参数，一般用于宏开关。
   */
  public getCustomRenderOption = (options: any) => {

  }

  /**
   * clone一个材质，一般不会重新编译program，但会生成一份新的`uniforms`。
   */
  public clone(): RawShaderMaterial {
    const material = new (this.constructor as any)(this._initOptions);
    material.initCommonOptions(this._initOptions);

    return material;
  }

  public destroyTextures() {
    super.destroyTextures();

    for (const propName in this._uniforms) {
      const texture = this._uniforms[propName].value;
      if (texture && isTexture(texture)) {
        texture.destroy();
      }
    }

    return this;
  }
}
