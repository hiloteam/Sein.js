/**
 * @File   : FrameBuffer.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/15/2019, 4:35:07 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import Game from '../Core/Game';
import Texture from '../Texture/Texture';

/**
 * 判断一个实例是否为`FrameBuffer`。
 */
export function isFrameBuffer(value: any): value is FrameBuffer {
  return (value as FrameBuffer).isFramebuffer;
}

/**
 * FrameBuffer的初始化参数。
 */
export interface IFrameBufferOptions {
  /**
   * width
   * 
   * @default game.screenWidth
   */
  width?: number;
  /**
   * height
   * 
   * @default game.screenHeight
   */
  height?: number;
  /**
   * bufferInternalFormat
   * @type {GLenum}
   * @default gl.DEPTH_STENCIL
   */
  bufferInternalFormat?: number;

  /**
   * target
   * @type {GLenum}
   * @default gl.TEXTURE_2D
   */
  target?: number;

  /**
   * internalFormat
   * @type {GLenum}
   * @default gl.RGBA
   */
  internalFormat?: number;

  /**
   * format
   * @type {GLenum}
   * @default gl.RGBA
   */
  format?: number;

  /**
   * type
   * @type {GLenum}
   * @default gl.UNSIGNED_BYTE
   */
  type?: number;

  /**
   * attachment
   * @type {GLenum}
   * @default gl.COLOR_ATTACHMENT0
   */
  attachment?: number;

  /**
   * 是否需要renderbuffer
   * @type {Boolean}
   * @default true
   */
  needRenderbuffer?: boolean;

  /**
   * 是否使用VAO
   * @type {Boolean}
   * @default true
   */
  useVao?: boolean;

  /**
   * minFilter
   * @type {GLenum}
   * @default gl.NEAREST
   */
  minFilter?: number;

  /**
   * magFilter
   * @type {GLenum}
   * @default gl.NEAREST
   */
  magFilter?: number;

  /**
   * create custom texture
   * @default null
   */
  createTexture?(): Texture;
  [key: string]: any;
}

/**
 * FrameBuffer。可以作为渲染的目标对象。
 */
export default class FrameBuffer extends Hilo3d.Framebuffer {
  constructor(game: Game, options?: IFrameBufferOptions) {
    super(game.renderer, options);
  }

  /**
   * create custom texture
   * @default null
   */
  createTexture?(): Texture;
  [key: string]: any;
}
