/**
 * @File   : PhysicPicker.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/26/2018, 12:18:54 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import Game from '../Core/Game';
import {ITouchEvent, IMouseEvent} from '../types/Event';
import {IPickOptions, IPickResult} from '../types/Physic';
import {Vector3} from '../Core/Math';
import UnmetRequireException from '../Exception/UnmetRequireException';
import Debug from '../Debug';

/**
 * 判断一个实例是否为`PhysicPicker`。
 */
export function isPhysicPicker(value: SObject): value is PhysicPicker {
  return (value as PhysicPicker).isPhysicPicker;
}

/**
 * 物理拾取器，用于拾取已经挂载了刚体和碰撞体的Actor。
 * 
 * @noInheritDoc
 */
@SClass({className: 'PhysicPicker'})
export default class PhysicPicker extends SObject {
  public isPhysicPicker = true;

  private _game: Game;
  private _options: IPickOptions;
  private _active: boolean = false;
  private _tmpTo: Vector3 = new Vector3();
  private _tmpFrom: Vector3 = new Vector3();
  private _tmpX: number;
  private _tmpY: number;

  constructor(game: Game) {
    super();

    this._game = game;
  }

  /**
   * 获取当前配置，你可以随时修改它。
   */
  get options() {
    return this._options;
  }

  /**
   * 开启拾取功能，你可以通过选项来设定不同模式。
   */
  public enablePicking(options?: IPickOptions) {
    if (!this._game.world.physicWorld) {
      throw new UnmetRequireException(this, 'Physic world is required for enable physic picking !');
    }

    if (this._active) {
      return;
    }

    this._options = options || {};
    this._options.type = this._options.type || 'down';
    this._active = true;

    if (this._options.type === 'up') {
      this._game.hid.add('MouseUp', this.handleMouse);
      this._game.hid.add('TouchEnd', this.handleTouch);
    } else if (this._options.type === 'down') {
      this._game.hid.add('MouseDown', this.handleMouse);
      this._game.hid.add('TouchStart', this.handleTouch);
    }
  }

  /**
   * 关闭拾取功能。
   */
  public disablePicking() {
    if (!this._game.world.physicWorld) {
      throw new UnmetRequireException(this, 'Physic world is required for enable physic picking !');
    }

    if (this._options.type === 'up') {
      this._game.hid.remove('MouseUp', this.handleMouse);
      this._game.hid.remove('TouchEnd', this.handleTouch);
    } else if (this._options.type === 'down') {
      this._game.hid.remove('MouseDown', this.handleMouse);
      this._game.hid.remove('TouchStart', this.handleTouch);
    }
  }

  private handleMouse = (event: IMouseEvent) => {
    const {left, top} = this._game.bound;

    this._tmpX = event.clientX - left;
    this._tmpY = event.clientY - top;

    this.pick(this._tmpX, this._tmpY);
  }

  private handleTouch = (event: ITouchEvent) => {
    const touch = event.changedTouches[0];

    if (!touch) {
      return;
    }

    const {left, top} = this._game.bound;

    this._tmpX = touch.clientX - left;
    this._tmpY = touch.clientY - top;

    this.pick(this._tmpX, this._tmpY);
  }

  /**
   * 通过屏幕空间的`x`和`y`触发一次拾取。
   * 这通常用于开发者想自定义拾取模式的时候，即`options.type === 'custom'`。
   */
  public pick(x: number, y: number) {
    const {screenWidth, screenHeight} = this._game;
    const {physicWorld} = this._game.world;

    const camera = this._game.world.mainCamera;

    if (!camera) {
      Debug.warn('Can not pick, world has no camera now !');
      return;
    }

    camera.generateRay(
      x, y,
      screenWidth, screenHeight,
      this._tmpFrom, this._tmpTo,
      this._options.rayLength
    );

    physicWorld.pick(
      this._tmpFrom,
      this._tmpTo,
      this.onPick,
      this._options
    );
  }

  private onPick = (results: IPickResult[]) => {
    if (this._options.filter) {
      results = this._options.filter(results);
    }

    results.forEach(result => {
      result.rigidBody.handlePick(result);
    });
  }
}
