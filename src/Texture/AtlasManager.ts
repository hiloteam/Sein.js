/**
 * @File   : AtlasManager.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/28/2018, 4:21:41 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import Texture from '../Texture/Texture';
import Debug from '../Debug';
import {Matrix3} from '../Core/Math';

/**
 * `AtlasManager`的初始化参数类型。
 */
export interface IAtlasOptions {
  /**
   * 图片。
   */
  image?: HTMLImageElement | HTMLCanvasElement;
  /**
   * 也可以直接传入一张纹理。
   */
  texture?: Texture;
  /**
   * 帧定义，若不指定`uv`则会自动按比例计算。
   */
  frames: {
    [key: string]: {
      /**
       * 帧的区块信息。
       */
      frame: {x: number, y: number, w: number, h: number};
      /**
       * 会自动生成，开发者无需关心。
       * 
       * @hidden
       */
      uvMatrix?: Matrix3;
      /**
       * 用于动态分配，开发者无需关心。
       * 
       * @hidden
       */
      right?: string;
      /**
       * 用于动态分配，开发者无需关心。
       * 
       * @hidden
       */
      down?: string;
      /**
       * 用于动态分配，开发者无需关心。
       * 
       * @hidden
       */
      space?: number;
    };
  };
  /**
   * 原信息，主要定义图片尺寸。
   */
  meta: {
    size: {w: number, h: number}
  };
}

/**
 * 判断一个实例是否为`AtlasManager`。
 */
export function isAtlasManager(value: any): value is AtlasManager {
  return (value as AtlasManager).isAtlasManager;
}

function isPowerOfTwo(x: number) {
  return (Math.log(x) / Math.log(2)) % 1 === 0;
}

export interface IAtlasCreationOptions {
  /**
   * 单元宽度。
   */
  cellWidth?: number;
  /**
   * 单元高度。
   */
  cellHeight?: number;
  /**
   * 单元间的间隙。
   */
  spacing?: number;
  /**
   * 每行有多少帧（单元）。
   */
  framesPerLine: number;
  /**
   * 需要从哪一帧开始。
   */
  frameStart?: number;
  /**
   * 需要几帧。
   */
  frameCount?: number;
}

/**
 * 图集管理器。
 * 一般通过`AtlasLoader`加载自动生成。
 * 
 * @noInheritDoc
 */
@SClass({className: 'AtlasManager'})
export default class AtlasManager extends SObject {
  public isAtlasManager = true;
  
  protected _AUTO_ID = 0;
  protected _image: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _tmpCanvas: HTMLCanvasElement;
  protected _texture: Texture;
  protected _frames: IAtlasOptions['frames'];
  protected _meta: IAtlasOptions['meta'];
  protected _canvases: {[frame: string]: HTMLCanvasElement};
  protected _textures: {[frame: string]: Texture};
  protected _updatable: boolean;
  protected _root: string;
  protected _area: number = 0;
  protected _needReBuild: boolean = false;

  /**
   * 根据宽高创建一个空的图集，可自由申请或释放帧。
   */
  public static CREATE_EMPTY(options: {width: number, height: number}) {
    const {width, height} = options;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, width, height);

    return new AtlasManager({image: canvas, frames: {}, meta: {size: {w: width, h: height}}}, true);
  }

  /**
   * 根据宽高和行数、列数来创建一个空的图集。
   * 这个图集将被行列分成若干个格子帧，开发者可以根据实际状况去使用`updateFrame`更新这些格子。
   * 自动生成的帧的名字为`${row}${col}`，比如第一行第一列为`'11'`。
   * 
   * @param onDraw 初始化时的回调，可以用于一开始绘制图像
   */
  public static CREATE_FROM_GRIDS(
    options: {
      width: number,
      height: number,
      rows: number,
      cols: number,
      space?: number
    },
    onDraw?: (
      atlas: AtlasManager,
      context: CanvasRenderingContext2D,
      region: {col: number, row: number, x: number, y: number, w: number, h: number},
      frameName: string
    ) => void
  ) {
    let {width, height, rows, cols, space} = options;
    space = space || 0;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, width, height);

    const w = ~~(width / cols) - space;
    const h = ~~(height / rows) - space;
    const frames = {};

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const frameName = `${row}${col}`;
        const x = col * (w + space);
        const y = row * (h + space);
        frames[frameName] = {
          frame: {x, y, w, h},
          space
        };
      }
    }

    const atlas = new AtlasManager({image: canvas, frames, meta: {size: {w: width, h: height}}}, true);

    if (onDraw) {
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const frameName = `${row}${col}`;
          const {x, y, w, h} = atlas.getFrame(frameName);
          onDraw(atlas, context, {x, y, w, h, row, col}, frameName);
        }
      } 
    }

    return atlas;
  }

  /**
   * 根据纹理和配置，来通过纹理创建一个不可修改的图集。通常用于精灵动画。
   * 这个图集将被行列分成若干个格子帧，每一帧的名字为`0`、`1`、`2`......
   */
  public static CREATE_FROM_TEXTURE(texture: Texture, options: IAtlasCreationOptions) {
    const w = options.cellWidth;
    const h = options.cellHeight;
    const {origWidth: width, origHeight: height} = texture;
    const spacing = options.spacing || 0;
    const {framesPerLine} = options;
    let {frameStart, frameCount} = options;

    if (frameStart === undefined) {
      frameStart = 0;
    }

    if (frameCount === undefined) {
      frameCount = Infinity;
    }

    const frames = {};
    let i = frameStart;
    while (true) {
      const row = framesPerLine === 1 ? i : ~~(i / framesPerLine);
      const col = framesPerLine === 1 ? 0 : i % framesPerLine;
      const x = col * (w + spacing);
      const y = row * (h + spacing);

      if (i >= frameCount || (y + h + spacing >= height)) {
        break;
      }

      frames[i] = {
        frame: {x, y, w, h}
      };

      i += 1;
    }

    return new AtlasManager({texture, frames, meta: {size: {w: width, h: height}}}, false);
  }

  /**
   * 构建一个图集。
   * 
   * @param options 初始化参数。
   * @param updatable 是否是一个可更新的图集，若不是则不可调用`updateFrame`等方法。注意`updatable`的图集本身容器的宽高都必须为**2的幂！**比如512、1024、2048等等。
   */
  constructor(options: IAtlasOptions, updatable: boolean = true) {
    super();
    this._frames = options.frames;
    this._meta = options.meta;
    this._canvases = {};
    this._textures = {};
    this._updatable = updatable;

    if (options.texture) {
      this._image = options.texture.image as any;
      this._texture = options.texture;
    } else if (options.image instanceof HTMLCanvasElement) {
      this._image = options.image;
      this._ctx = this._image.getContext('2d');
    } else if (updatable) {
      if (Debug.devMode && !(isPowerOfTwo(this._meta.size.w) && isPowerOfTwo(this._meta.size.h))) {
        throw new Error(`Atlas ${this.name} is updatable but it size is not power of two !`);
      }

      this._image = document.createElement('canvas');
      this._image.width = this._meta.size.w;
      this._image.height = this._meta.size.h;
      this._ctx = this._image.getContext('2d');
      this._ctx.drawImage(options.image, 0, 0);
    } else {
      this._image = options.image as any;
    }
  }

  /**
   * 获取整体图片数据。
   */
  get image() {
    return this._image;
  }

  /**
   * 获取元信息。
   */
  get meta() {
    return this._meta;
  }

  /**
   * 获取帧集合。
   */
  get frames() {
    return this._frames;
  }

  /**
   * 获取整体的纹理，也可以使用`getWholeTexture`。
   */
  get texture() {
    return this.getWholeTexture();
  }

  /**
   * 获取当前图集的使用率，仅在**动态图集**的状况下有效。
   */
  get usage() {
    const {w, h} = this._meta.size;
    return this._area / (w * h);
  }

  /**
   * 纹理提交GPU后是否释放CPU内存
   */
  public isImageCanRelease?: boolean = false;

  /**
   * 获取某一帧的数据。
   */
  public getFrame(frameName: string): {x: number, y: number, w: number, h: number} {
    return this._frames[frameName].frame;
  }

  /**
   * @deprecated 
   * 
   * 请用`getUVMatrix`
   * 获取某一帧的uv。
   */
  public getUV(frameName: string): {x: number, y: number, w: number, h: number} {
    throw new Error('`getUV` is deprecated, please use `getUVMatrix`!')
  }

  /**
   * 获取某一帧的uv变换矩阵。
   */
  public getUVMatrix(frameName: string): Matrix3 {
    const f = this._frames[frameName];

    if (!f) {
      throw new Error(`Frame ${frameName} is not existed!`);
    }

    const {uvMatrix, frame} = f;

    if (!uvMatrix) {
      f.uvMatrix = this.buildUVMatrix(frame);
    }

    return f.uvMatrix;
  }

  protected buildUVMatrix(frame: {x: number, y: number, w: number, h: number}) {
    const {w, h} = this._meta.size;
    const matrix = new Matrix3();
    // flipY
    matrix.set(
      frame.w / w,
      0,
      0,
      0,
      -frame.h / h,
      0,
      frame.x / w,
      (frame.y + frame.h) / h,
      1
    );

    return matrix;
  }

  /**
   * 获取某一帧的图片数据，**会创建独立的canvas，慎重使用！**。建议使用`getTexture`。
   */
  public getFrameImage(frameName: string): HTMLCanvasElement {
    if (!this._canvases[frameName]) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const {x, y, w, h} = this._frames[frameName].frame;

      canvas.width = w;
      canvas.height = h;
      context.drawImage(this._image, x, y, w, h);

      this._canvases[frameName] = canvas;
    }

    return this._canvases[frameName];
  }

  /**
   * 获取某一帧的纹理数据，**会创建独立的canvas，慎重使用！**。建议使用`getWholeTexture`。
   */
  public getTexture(frameName: string, options?: any) {
    if (!options && this._textures[frameName]) {
      return this._textures[frameName];
    }

    const frame = this.getFrame(frameName);
    const {x, y, w, h} = frame;
    let image: ImageData;

    if (this._image instanceof HTMLImageElement) {
      if (!this._tmpCanvas) {
        this._tmpCanvas = document.createElement('canvas');
        this._tmpCanvas.width = this._image.width;
        this._tmpCanvas.height = this._image.height;
      }
      const ctx = this._tmpCanvas.getContext('2d');
      ctx.drawImage(this._image, x, y, w, h, 0, 0, w, h);
      image = ctx.getImageData(0, 0, w, h);
    } else if (this._image instanceof HTMLCanvasElement) {
      const ctx = this._image.getContext('2d');
      image = ctx.getImageData(x, y, w, h);
    } else {
      Debug.warn(`Image is 'ArrayBuffer', not support get a frame !`)
    }

    if (options) {
      return new Texture({image, isImageCanRelease: this.isImageCanRelease, ...options});
    }

    this._textures[frameName] = new Texture({image, isImageCanRelease: this.isImageCanRelease});
    return this._textures[frameName];
  }

  /**
   * 获取整体纹理数据，建议配合`getFrame`或`getUVMatrix`在shader中使用。
   */
  public getWholeTexture(options?: any) {
    if (options) {
      if (this._texture) {
        this._texture.destroy();
      }

      return this._texture = new Texture({image: this._image, isImageCanRelease: this.isImageCanRelease, ...options});
    }

    if (!this._texture) {
      this._texture = new Texture({image: this._image, isImageCanRelease: this.isImageCanRelease});
    }

    return this._texture;
  }

  /**
   * 更新某一frame，通过`onDraw`方法参数中的`context`和`region`来更新`canvas`画布上此帧所占据区域内的图像，并同步到GPU。
   */
  public updateFrame(
    frameName: string,
    onDraw: (context: CanvasRenderingContext2D, region: {x: number, y: number, w: number, h: number}, frameName: string) => void
  ) {
    if (!this._updatable) {
      throw new Error(`Atlas ${this.name} is not updatable !`);
    }

    if (this._canvases[frameName]) {
      delete this._canvases[frameName];
    }

    if (this._textures[frameName]) {
      delete this._textures[frameName];
    }

    const {x, y, w, h} = this.getFrame(frameName);
    onDraw(this._ctx, {x, y, w, h}, frameName);

    this.updateGlSubBuffer(x, y, w, h);
  }

  /**
   * 申请分配指定的`region`大小的一帧，其中`frameName`是你想要赋予的名字，若不传会自动生成。
   * 如果分配成功，则会通过`onDraw`的参数返回`context`、实际区域`region`和被分配的帧名`frameName`，你可以在这个方法中绘制。
   * 
   * @returns [string] 若成功，将返回分配的`frame`的名字，否则返回`null`。
   */
  public allocateFrame(
    region: {w: number, h: number, space?: number, frameName?: string},
    onDraw?: (
      context: CanvasRenderingContext2D,
      region: {x: number, y: number, w: number, h: number},
      frameName: string
    ) => void
  ): string {
    if (!this._updatable) {
      throw new Error(`Atlas ${this.name} is not updatable !`);
    }

    let {frameName} = region;
    if (frameName && this._frames[frameName]) {
      throw new Error(`Frame named ${frameName} is not already existed !`);
    }

    if (this._needReBuild) {
      this.rebuildFrames();
    }

    frameName = this.generateFrame(this._root, region);

    if (!frameName) {
      return null;
    }

    this._area += region.w * region.h;

    if (onDraw) {
      const {x, y, w, h} = this.getFrame(frameName);
      onDraw(this._ctx, {x, y, w, h}, frameName);
      this.updateGlSubBuffer(x, y, w, h);
    }


    return frameName;
  }

  protected generateFrame(
    rootFrame: string,
    region: {w: number, h: number, space?: number, frameName?: string},
    bottom?: number
  ): string {
    let {w, h, space = 0, frameName} = region;
    let {size} = this._meta;
  
    if (bottom === undefined) {
      bottom = this._meta.size.h;
    }

    if (!this._root) {
      return this._root = this.addFrame(0, 0, w, h, frameName);
    }

    const root = this._frames[rootFrame];
    let {right, down, frame} = root;
    const x = frame.x + frame.w + space;
    const y = frame.y + frame.h + space;
    const aW = size.w - x;
    const aH = bottom - y;

    if (!right && !down && w <= aW && h <= frame.h) {
      return root.right = this.addFrame(x, frame.y, w, h, frameName, space);
    }

    if (!right && w <= aW && h <= frame.h) {
      return root.right = this.addFrame(x, frame.y, w, h, frameName, space);
    }

    if (!down && w <= (size.w - frame.x) && h <= aH) {
      return root.down = this.addFrame(frame.x, y, w, h, frameName, space);
    }

    if (right && (frameName = this.generateFrame(right, region, y))) {
      return frameName;
    }
    
    if (down && (frameName = this.generateFrame(down, region, bottom))) {
      return frameName;
    }

    return null;
  }

  public rebuildFrames() {
    const {size} = this._meta;

    if (!this._tmpCanvas) {
      const tmp = this._tmpCanvas = document.createElement('canvas');
      tmp.width = size.w;
      tmp.height = size.h;
    }
    const tmpCtx = this._tmpCanvas.getContext('2d');
    tmpCtx.drawImage(this._image, 0, 0);

    this._ctx.clearRect(0, 0, size.w, size.h);
    this._ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    this._ctx.fillRect(0, 0, size.w, size.h);

    const frames = Object.assign({}, this._frames);
    this._frames = {};
    this._root = null;
    const keys = Object.keys(frames).sort((a, b) => {
      return frames[b].frame.h - frames[a].frame.h;
    });

    keys.forEach(frameName => {
      const frame = frames[frameName];
      const {w, h} = frame.frame;
      this.generateFrame(this._root, {w, h, frameName, space: frame.space});
      const {x, y} = this._frames[frameName].frame;
      const orig = frames[frameName].frame;
      this._ctx.drawImage(this._tmpCanvas, orig.x, orig.y, w, h, x, y, w, h)
    });

    this.updateGlSubBuffer(0, 0, size.w, size.h);
    this._needReBuild = false;
  }

  protected addFrame(x: number, y: number, w: number, h: number, frameName?: string, space?: number) {
    frameName = frameName || `AUTO-${this._AUTO_ID++}`;
    this._frames[frameName] = {frame: {x, y, w, h}, space};

    return frameName;
  }

  /**
   * 释放一帧的空间，将其标记为可分配状态。
   */
  public releaseFrame(frameName: string) {
    if (!this._updatable) {
      throw new Error(`Atlas ${this.name} is not updatable !`);
    }

    const frame = this._frames[frameName];
    if (frame) {
      if (this._texture[frameName]) {
        this._texture.destroy();
      }

      if (this._canvases[frameName]) {
        delete this._canvases[frameName];
      }

      delete this._frames[frameName];

      this._area -= frame.frame.h * frame.frame.w;

      this._needReBuild = true;
    }
  }

  protected updateGlSubBuffer(x: number, y: number, w: number, h: number) {
    if (!this._texture) {
      return;
    }

    this._texture.updateSubTexture(x, this._texture.flipY ? this._meta.size.h - y - h : y, this._ctx.getImageData(x, y, w, h));
  }

  /**
   * 完全销毁释放图集。
   */
  public destroy() {
    for (const key in this._textures) {
      this._textures[key].destroy();
    }

    if (this._texture) {
      this._texture.destroy();
    }
  }
}
