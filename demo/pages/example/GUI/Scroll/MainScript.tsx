/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/23/2019, 3:28:21 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Root extends React.Component {
  public render() {
    return (
      <Sein.GUI.Scroll
        shape={new Sein.Vector2(200, 200)}
        x={400}
        y={50}
        padding={new Sein.Vector4(10, 10, 10, 10)}
        initialPos={new Sein.Vector2(40, 40)}
      >
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          background={new Sein.Color(0.965, 0.325, 0.078)}
          x={10}
          y={10}
        />
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          background={new Sein.Color(0.486, 0.733, 0)}
          x={130}
          y={10}
        />
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          background={new Sein.Color(0, 0.631, 0.945)}
          x={10}
          y={130}
        />
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          background={new Sein.Color(1.0, 0.733, 0)}
          x={130}
          y={130}
        />
      </Sein.GUI.Scroll>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Texture', url: '/assets/paradise.jpg', name: 'paradise.jpg', flipY: true});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game);

    // 在实际使用GUI系统的所有功能之前，先至少添加一个GUI系统
    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root />
    });
  }
}