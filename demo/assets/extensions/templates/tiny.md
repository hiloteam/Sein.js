# Tiny

**Tiny**模板，最为最简化的Sein**游戏项目**模板，提供了一个最小可实现的Sein游戏工程。使用这个模板，开发者不需要关心什么世界、关卡的调度，只需要根据**game/script.ts**脚本中的生命周期进行游戏逻辑的编写即可。它适用于一些很简单的休闲小游戏项目。

这些生命周期基本完全等价于`Sein.LevelScriptActor`的生命周期，详见注释：  

```ts
/**
 * 游戏启动时触发。
 */
export async function onAdd(game: Sein.Game<GameState>) {

}

/**
 * 用于用户登录，异步。
 */
export async function onLogin(game: Sein.Game<GameState>) {

}

/**
 * 游戏资源预加载放在这里。
 */
export function onPreLoad(game: Sein.Game<GameState>) {
  game.resource.load({type: 'GlTF', name: 'miku.gltf', url: '/assets/gltfs/miku.gltf'});
}

/**
 * 更新游戏加载进度。
 */
export function onLoading(game: Sein.Game<GameState>, state: Sein.IResourceState) {
  console.log(state.current, state.progress);
}

/**
 * 资源加载完成后，创建相机、灯光，并实例化模型。
 */
export function onCreate(game: Sein.Game<GameState>) {
  createCamera(game);
  createLights(game);

  const miku = game.resource.instantiate<'GlTF'>('miku.gltf').get(0);
  miku.transform.setPosition(0, 0, 4);
}

/**
 * 每一帧更新。
 */
export function onUpdate(game: Sein.Game<GameState>, delta: number) {
  const miku = Sein.findActorByName(game.world, 'Sein');
  miku.transform.rotate(miku.transform.upVector, .02);
}

/**
 * 游戏出错时触发。
 */
export function onError(error: Sein.BaseException, details: any) {
  
}

/**
 * 游戏销毁时触发。
 */
export function onDestroy(game: Sein.Game<GameState>) {

}
```
