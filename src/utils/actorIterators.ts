/**
 * @File   : sceneActorIterators.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/29/2018, 11:47:24 AM
 * @Description:
 */
import SceneActor from '../Renderer/ISceneActor';
import Actor, {isActor} from '../Core/Actor';
import {TConstructor} from '../types/Common';
import World from '../Core/World';
import Game from '../Core/Game';
import SArray from '../DataStructure/SArray';
import ChildActorComponent from '../Core/ChildActorComponent';

export type TActorParent = Game | World | Actor;

/**
 * @hidden
 */
export function bfs(
  parent: Actor,
  func: (child: Actor) => boolean | void
) {
  let children = parent.findComponentsByClass<ChildActorComponent<Actor>>(ChildActorComponent);
  let length = children.length;
  let tmp: ChildActorComponent<Actor>[] = [];

  for (let i = 0; i < length; i += 1) {
    const actor = children[i].actor;

    if (func(actor)) {
      return;
    }

    Array.prototype.push.apply(tmp, actor.findComponentsByClass<ChildActorComponent<Actor>>(ChildActorComponent));

    if (i === length - 1) {
      children = tmp;
      length = children.length;
      i = 0;
      tmp = [];
    }
  }
}

/**
 * 迭代`parent`下的所有`actors`。
 * 
 * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
 */
export function iterateActors(
  parent: TActorParent,
  func: (actor: Actor) => boolean | void
): void {
  if (isActor(parent)) {
    bfs(parent, func);

    return;
  }

  (parent.actors as SArray<Actor>).forEach(func);
}

/**
 * 迭代`parent`下的所有名字为`name`的`actors`。
 * 
 * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
 */
export function iterateActorsByName(
  parent: TActorParent,
  name: string,
  func: (actor: Actor) => boolean | void
): void {
  iterateActors(parent, actor => {
    if (!actor.name.equalsTo(name)) {
      return false;
    }

    return func(actor);
  });
}

/**
 * 迭代`parent`下的所有标签为`tag`的`actors`。
 * 
 * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
 */
export function iterateActorsByTag(
  parent: TActorParent,
  tag: string,
  func: (actor: Actor) => boolean | void
): void {
  iterateActors(parent, actor => {
    if (!actor.tag.equalsTo(tag)) {
      return false;
    }

    return func(actor);
  });
}

/**
 * **暂时没用。**
 * 迭代`parent`下的所有类的类型为`classType`的`actors`。
 * 
 * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
 */
export function iterateActorsByClassType(
  parent: TActorParent,
  classType: string,
  func: (actor: Actor) => boolean | void
): void {
  iterateActors(parent, actor => {
    if (!actor.classType.equalsTo(classType)) {
      return false;
    }

    return func(actor);
  });
}

/**
 * 迭代`parent`下的所有类型为`Class`的`actors`。
 * 
 * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
 */
export function iterateActorsByClass(
  parent: TActorParent,
  Class: TConstructor<SceneActor>,
  func: (actor: Actor) => boolean | void
): void {
  iterateActors(parent, actor => {
    if (!actor.className.equalsTo(Class.CLASS_NAME)) {
      return false;
    }

    return func(actor);
  });
}
