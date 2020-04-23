/**
 * @File   : SName.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/10/8 上午11:13:40
 * @Description:
 */
/**
 * 判断一个实例是否为`isSName`。
 */
export function isSName(value: any): value is SName {
  return (value as SName).isSName;
}

/**
 * 一个字符串池，用于构建名字，后续可以快速拿来进行对比。
 */
export default class SName {
  public isSName = true;
  private static INDEX: number = 0;
  private static TABLE: {[name: string]: number} = {};

  private _value: string = '';
  private _index: number = 0;

  /**
   * 通过字符串创建一个实例。
   */
  constructor(name: string) {
    this._value = name;

    if (!SName.TABLE[name]) {
      SName.INDEX += 1;
      SName.TABLE[name] = SName.INDEX;
    }

    this._index = SName.TABLE[name];
  }

  /**
   * 获取实例的字符串值。
   */
  get value(): string {
    return this._value;
  }

  /**
   * 判断实例是否等同于某字符串。
   */
  public equalsTo(name: string): boolean;
  /**
   * 判断实例是否等同于另一个`SName`实例。
   */
  public equalsTo(name: SName): boolean;
  public equalsTo(name: string | SName): boolean {
    if (isSName(name)) {
      return this._index === name._index;
    }

    if (!SName.TABLE[name]) {
      return false;
    }

    return SName.TABLE[name] === this._index;
  }

  /**
   * @hidden
   */
  public toString() {
    return this._value;
  }
}
