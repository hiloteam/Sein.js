# Simple

**Simple**模板，是具有Sein完整玩法逻辑框架的最小系统，其基本体现了一个完成的基于Sein的游戏开发框架。[开始引导教程](../../tutorial)以及教程中的[Hello world](../../guide/hello-world)就是按照此模板编写的，此模板提供了：

## components

组件目录，用于存放公共组件。内部有一个示例组件`FloatingComponent`，用于给SceneActor添加浮动的功能。

## scripts

脚本目录，用于存放世界玩法逻辑脚本`GameModeActor`和关卡脚本`LevelScriptActor`。

内部有一些默认逻辑，比如`MainGameMode`中会在每一帧更新`GameState`的系数，`MainLevelScript`会实现模型加载、实例化，灯光创建、物体每帧转动等逻辑。

## states

状态目录，用于存放各种状态，比如游戏状态`GameState`。
