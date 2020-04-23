/**
 * @File   : RenderSystemActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/15/2019, 5:09:59 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import SystemActor from '../Info/SystemActor';
import {SClass} from '../Core/Decorator';

/**
 * 判断一个实例是否为`RenderSystemActor`。
 */
export function isRenderSystemActor(
  value: SObject
): value is RenderSystemActor {
  return (value as RenderSystemActor).isRenderSystemActor;
}

/**
 * 渲染系统，可以用于精确控制整个渲染流程，达到需要多个PASS的渲染的效果（例如镜面、后处理等等）。
 *
 * 实例请见[进阶渲染](../../example/render/advance)。
 */
@SClass({className: 'RenderSystemActor'})
export default class RenderSystemActor<
  IOptionTypes extends Object = {}
> extends SystemActor<IOptionTypes> {
  public isRenderSystemActor = true;

  private handlePreRender = () => this.onPreRender(this._initOptions);
  private handlePostClear = () => this.onPostClear(this._initOptions);
  private handlePostRender = () => this.onPostRender(this._initOptions);

  /**
   * 初始化，继承请先调用`super.onInit`。
   */
  public onInit(initOptions: IOptionTypes) {
    this.bindEvents();
  }

  /**
   * 取消链接，将会暂时让功能失效，继承请先调用`super.onUnLink`。
   */
  public onUnLink() {
    this.unBindEvents();
  }

  /**
   * 取消链接，将会让功能恢复，继承请先调用`super.onReLink`。
   */
  public onReLink() {
    this.bindEvents();
  }

  /**
   * 在整个世界中的所有物体被默认渲染前触发。
   * **注意不要在这里切换主相机！**
   */
  public onPreRender(initOptions: IOptionTypes) {

  }

  /**
   * 在整个画面被`Clear`后触发。
   * 如果想默认渲染到`Renderer`内置的`Frame`或者插入一些类似于手机相机的画面等，可以在这里完成。
   * **注意不要在这里修改任何图层！也不要在这里切换主相机！**
   */
  public onPostClear(initOptions: IOptionTypes) {

  }

  /**
   * 在整个所有的模型被默认渲染到屏幕后触发。
   * **注意不要在这里切换主相机！**
   */
  public onPostRender(initOptions: IOptionTypes) {

  }

  /**
   * 销毁逻辑，继承请先调用`super.onDestroy`。
   */
  public onDestroy() {
    this.unBindEvents();
  }

  private bindEvents() {
    const game = this.getGame();

    game.event.add('MainRendererWillStart', this.handlePreRender);
    game.event.add('MainRendererIsCleared', this.handlePostClear);
    game.event.add('MainRendererIsFinished', this.handlePostRender);
  }

  private unBindEvents() {
    const game = this.getGame();

    game.event.remove('MainRendererWillStart', this.handlePreRender);
    game.event.remove('MainRendererIsCleared', this.handlePostClear);
    game.event.remove('MainRendererIsFinished', this.handlePostRender);
  }
}
