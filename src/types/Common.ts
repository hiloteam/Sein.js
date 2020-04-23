/**
 * @File   : Common.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/10/3 下午11:53:06
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import SName from '../Core/SName';

/**
 * 用于推断继承自SObject的类。
 */
export type TConstructor<TInstance> = {
  new(...args: any[]): TInstance;
  CLASS_TYPE: SName;
  CLASS_NAME: SName;
  INSPECTABLE_PROPERTIES?: {
    [property: string]: {
      readonly?: boolean;
      type?: string;
      options?: any
    }
  };
};

/**
 * @hidden
 */
export type TGameModeConstructor<TInstance> = {
  new(...args: any[]): TInstance;
  CLASS_TYPE: SName;
  CLASS_NAME: SName;
  WorldStateClass: TConstructor<any>;
};

/**
 * @hidden
 */
export type TLevelScriptConstructor<TInstance> = {
  new(...args: any[]): TInstance;
  CLASS_TYPE: SName;
  CLASS_NAME: SName;
  LevelStateClass: TConstructor<any>;
};

/**
 * @hidden
 */
export type TBound = {
  start: Hilo3d.Vector3;
  end: Hilo3d.Vector3;
};

/**
 * @hidden
 */
export enum ESpace {
  BONE = 0,
  LOCAL = 1,
  WORLD = 2,
  VIEW = 3,
  NDC = 4,
  SCREEN = 5
}

export interface IDeviceInfo {
  touchable: boolean;
}
