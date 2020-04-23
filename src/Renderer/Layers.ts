/**
 * @File   : Layers.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 1/28/2019, 7:58:47 PM
 * @Description:
 */
/**
 * 判断一个实例是否为`Layers`。
 */
export function isLayers(value: any): value is Layers {
  return (value as Layers).isLayers;
}

/**
 * 图层类。用于在开启`World`的图层功能时，快速切换可视对象。
 * 图层是根据一个32通道的mask设定的，你可以通过这个类的一些方法开启或关闭某个或某些通道。
 * 图层可以给每个`Actor`设定，其中包含当前主相机的`Actor`负责测试所有实例是否可见。
 * 
 * 实例请见[Layers](../../example/render/layers)。
 */
export default class Layers {
  public isLayers = true;
  protected _mask: number = 0xffffffff;

  /**
   * 强制设置为某些通道。
   */
  public set(channel: number) {
    this._mask = 1 << channel | 0;
  }

  /**
   * 切换某些通道。
   */
  public toggle(channel: number) {
    this._mask ^= (1 << channel | 0);
  }

  /**
   * 开启某些通道。
   */
  public enable(channel: number) {
    this._mask |= (1 << channel | 0);
  }

  /**
   * 关闭某些通道。
   */
  public disable(channel: number) {
    this._mask &= ~(1 << channel | 0);
  }

  /**
   * 通道复位。
   */
  public reset() {
    this._mask = 0xffffffff;
  }

  /**
   * 和另一个图层进行测试。
   */
  public test(layers: Layers) {
    return (this._mask & layers._mask) !== 0;
  }
}
