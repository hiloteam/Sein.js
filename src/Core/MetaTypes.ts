/**
 * @File   : MetaTypes.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/21/2018, 10:42:13 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import {TConstructor} from '../types/Common';
import Material from '../Material/Material';

/**
 * 全局单例，存储着所有`SClass`的键(`className`)和类的对应表。
 */
export const MetaSClasses: {[className: string]: TConstructor<SObject>} = {};
/**
 * 全局单例，存储着所有`SMaterial`的键(`className`)和类的对应表。
 */
export const MetaSMaterials: {[className: string]: {new(...args: any[]): Material}} = {};
