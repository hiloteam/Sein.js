/**
 * @File   : ISceneActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/17/2018, 4:09:04 PM
 * @Description:
 */
import Actor from '../Core/Actor';
import Level from '../Core/Level';
import {ISceneComponentState} from '../Renderer/ISceneComponent';
import SceneComponent from '../Renderer/SceneComponent';
import ChildActorComponent from '../Core/ChildActorComponent';
import AnimatorComponent from '../Animation/AnimatorComponent';
import RigidBodyComponent from '../Physic/RigidBodyComponent';
import SObject from '../Core/SObject';
import Layers from '../Renderer/Layers';
import * as Math from '../Core/Math';

export function isSceneActor(value: SObject): value is ISceneActor {
  return (value as ISceneActor).isSceneActor;
}

export default interface ISceneActor<
  IOptionTypes extends ISceneComponentState = ISceneComponentState,
  TRootComponent extends SceneComponent = SceneComponent
> extends Actor<
  IOptionTypes,
  TRootComponent
> {
  isSceneActor: boolean;
  isStatic: boolean;
  needReleaseGlRes: boolean;
  persistent: boolean;
  layers: Layers;
  readonly parent: Level | ChildActorComponent<ISceneActor>;
  readonly transform: TRootComponent;
  readonly rigidBody: RigidBodyComponent;
  readonly animator: AnimatorComponent<any>;
  visible: boolean;
  destroy(): void;
  getBounds(bounds?: Math.Bounds, currentMatrix?: Math.Matrix4): Math.Bounds;
}
