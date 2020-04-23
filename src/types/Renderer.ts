/**
 * @File   : Renderer.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 2:43:28 PM
 * @Description:
 */
/**
 * 阴影设置类型接口。
 */
export interface IShadowOptions {
  /**
   * 是否显示生成的阴影贴图。
   * 
   * @default false
   */
  debug?: boolean;
  /**
   * 阴影贴图的宽，默认为画布宽。
   * 
   * @default render.width
   */
  width?: number;
  /**
   * 阴影贴图的高，默认为画布高。
   * 
   * @default render.height
   */
  height?: number;
  /**
   * depth最大差值，实际的bias为max(maxBias * (1 - dot(normal, lightDir)), minBias)。
   * 
   * @default 0.05
   */
  maxBias?: number;
  /**
   * depth最小差值。
   * 
   * @default 0.005
   */
  minBias?: number;
}
