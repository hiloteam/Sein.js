/**
 * @File   : sceneActorFinders.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 7:34:45 PM
 * @Description:
 */
import SceneActor from '../Renderer/ISceneActor';
import Actor from '../Core/Actor';
import {TConstructor} from '../types/Common';
import {isWorld} from '../Core/World';
import {isGame} from '../Core/Game';
import {iterateActors, bfs, TActorParent} from '../utils/actorIterators';

/**
 * 通过筛选函数`filter`查找`parent`下的首个`actor`。
 * 
 * @param filter 筛选函数，若返回`true`。
 */
export function findActorByFilter<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  filter: (actor: Actor) => boolean
): TActor {
  let result: Actor = null;
  iterateActors(parent, actor => {
    if (filter(actor)) {
      result = actor;

      return true;
    }

    return false;
  });

  return result as TActor;
}

/**
 * 通过删选函数`filter`查找`parent`下的所有`actor`。
 * 
 * @param filter 筛选函数。
 * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
 */
export function findActorsByFilter<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  filter: (actor: Actor) => boolean,
  stopFinding?: (actor: Actor, actors?: TActor[]) => boolean
): TActor[] {
  const result: TActor[] = [];

  iterateActors(parent, actor => {
    if (filter(actor)) {
      result.push(actor as TActor);
    }

    if (stopFinding && stopFinding(actor, result)) {
      return true;
    }
  });

  return result;
}

/**
 * 通过名字`name`查找`parent`下的首个`actor`。
 */
export function findActorByName<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  name: string
): TActor {
  return findActorByFilter<TActor>(parent, actor => actor.name.equalsTo(name));
}

/**
 * 通过名字路径`namePath`查找`parent`下的首个`actor`。
 */
export function findActorByNamePath<TActor extends Actor = SceneActor>(
  p: TActorParent,
  namePath: string[]
): TActor {
  let length = namePath.length;
  let parent: Actor;

  if (isGame(p)) {
    parent = p.actors.findByName(namePath[0]);
  } else if (isWorld(p)) {
    parent = p.actors.findByName(namePath[0]);
  } else {
    parent = p;
  }

  if (!parent) {
    return null;
  }

  if (length === 1) {
    return parent as TActor;
  }

  namePath.splice(0, 1);
  length -= 1;

  if (length === 0) {
    return null;
  }

  let current = parent;
  let name: string;

  for (let index = 0; index < length; index += 1) {
    name = namePath[index];

    bfs(current, actor => {
      if (actor.name.equalsTo(name)) {
        current = actor;

        return true;
      }

      current = null;
      return false;
    });

    if (!current) {
      return null;
    }
  }

  if (current === parent) {
    return null;
  }

  return current as TActor;
}

/**
 * 通过名称`name`查找`parent`下的所有`actor`。
 * 
 * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
 */
export function findActorsByName<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  name: string,
  stopFinding?: (actor: Actor, actors?: TActor[]) => boolean
): TActor[] {
  return findActorsByFilter<TActor>(parent, actor => actor.name.equalsTo(name), stopFinding);
}

/**
 * 通过标签`tag`查找`parent`下的首个`actor`。
 */
export function findActorByTag<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  tag: string
): TActor {
  return findActorByFilter<TActor>(parent, actor => actor.tag.equalsTo(tag));
}

/**
 * 通过标签`tag`查找`parent`下的所有`actor`。
 * 
 * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
 */
export function findActorsByTag<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  tag: string,
  stopFinding?: (actor: Actor, actors?: TActor[]) => boolean
): TActor[] {
  return findActorsByFilter<TActor>(parent, actor => actor.tag.equalsTo(tag), stopFinding);
}

/**
 * 通过位移ID`uuid`查找`parent`下的首个`actor`。
 */
export function findActorByUUID<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  uuid: number
): TActor {
  return findActorByFilter<TActor>(parent, actor => actor.uuid === uuid);
}

/**
 * 通过类的类型`className`查找`parent`下的首个`actor`。
 */
export function findActorByClassName<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  className: string
): TActor {
  return findActorByFilter<TActor>(parent, actor => actor.className.equalsTo(className));
}

/**
 * 通过类的类型`className`查找`parent`下的所有`actor`。
 * 
 * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
 */
export function findActorsByClassName<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  className: string,
  stopFinding?: (actor: Actor, actors?: TActor[]) => boolean
): TActor[] {
  return findActorsByFilter<TActor>(parent, actor => actor.className.equalsTo(className), stopFinding);
}

/**
 * 通过类型`Class`查找`parent`下的首个`actor`。
 */
export function findActorByClass<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  Class: TConstructor<TActor>
): TActor {
  return findActorByFilter<TActor>(parent, actor => actor.className.equalsTo(Class.CLASS_NAME));
}

/**
 * 通过类型`Class`查找`parent`下的所有`actor`。
 * 
 * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
 */
export function findActorsByClass<TActor extends Actor = SceneActor>(
  parent: TActorParent,
  Class: TConstructor<TActor>,
  stopFinding?: (actor: Actor, actors?: TActor[]) => boolean
): TActor[] {
  return findActorsByFilter<TActor>(parent, actor => actor.className.equalsTo(Class.CLASS_NAME), stopFinding);
}
