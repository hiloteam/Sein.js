/**
 * @File   : DynamicTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/31/2018, 10:59:45 AM
 * @Description:
 */
import Texture from '../Texture/Texture';

/**
 * 判断一个实例是否为`DynamicTexture`。
 */
export function isDynamicTexture(value: Texture): value is DynamicTexture {
  return (value as DynamicTexture).isDynamicTexture;
}

/**
 * `DynamicTexture`的初始化参数类型。
 */
export interface IDynamicTextureOptions {
  /**
   * 纹理初始化时调用的函数，你可以在这里通过canvas初始化绘制你的贴图。
   * 通过返回值来决定是否要更新buffer，返回`false`不更新，默认更新。
   */
  onInit?(context: CanvasRenderingContext2D, options: IDynamicTextureOptions): void | boolean;
  /**
   * 纹理在每次被绘制时调用的函数，你可以在这里通过canvas绘制你的纹理。
   * 通过返回值来决定是否要更新buffer，返回`false`不更新，默认更新。
   */
  onDraw?(context: CanvasRenderingContext2D): void | boolean;
  /**
   * 贴图宽度，像素。
   */
  width: number;
  /**
   * 贴图高度，像素。
   */
  height: number;
}

/**
 * 动态纹理类。
 * 
 * @template IDynamicTextureOptions 动态纹理的初始化参数类型。
 * @noInheritDoc
 */
export default class DynamicTexture<
  IOptions extends IDynamicTextureOptions = IDynamicTextureOptions
> extends Texture {
  public isDynamicTexture = true;
  protected _canvas: HTMLCanvasElement;
  protected _context: CanvasRenderingContext2D;

  constructor(options: IOptions) {
    super(options);
    (this as any).image = this._canvas = document.createElement('canvas');
    this._canvas.width = options.width;
    this._canvas.height = options.height;
    this._context = this._canvas.getContext('2d');

    const needUpdate = this.onInit(this._context, options);
    this.needUpdate = needUpdate === false ? false : true;
  }

  get context() {
    return this._context;
  }

  /**
   * 纹理初始化时调用的函数，你可以在这里通过canvas初始化绘制你的贴图。
   * 通过返回值来决定是否要更新buffer，返回`false`不更新，默认更新。
   */
  public onInit(context: CanvasRenderingContext2D, initOptions: IOptions): void | boolean {
    return false;
  }

  /**
   * 纹理在每次被绘制时调用的函数，你可以在这里通过canvas绘制你的纹理。
   * 通过返回值来决定是否要更新buffer，返回`false`不更新，默认更新。
   */
  public onDraw(context: CanvasRenderingContext2D): void | boolean {
    return false;
  }

  /**
   * 触发绘制回调。
   */
  public draw() {
    const needUpdate = this.onDraw(this._context);
    this.needUpdate = needUpdate === false ? false : true;
  }
}
