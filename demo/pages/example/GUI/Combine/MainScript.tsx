/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 9/3/2019, 8:20:07 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Root extends Sein.GUI.Component<{}, {}> {
  public render() {
    const game = this.system.getGame();
    return (
      <Sein.GUI.Combine
        shape={new Sein.Vector2(200, 250)}
        x={200}
        y={30}
        background={new Sein.Color(1.0, 0.8, 0.2, 1.0)}
      >
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          x={50}
          y={30}
          rotation={Math.PI/4}
          background={new Sein.Color(1.0, 0.4, 0.4, 1.0)}
        >
          <Sein.GUI.Container
            shape={new Sein.Vector2(50, 50)}
            x={25}
            y={25}
            background={game.resource.get<'Texture'>('paradise.jpg')}
          />
        </Sein.GUI.Container>
        <Sein.GUI.Label
          shape={new Sein.Vector2(100, 50)}
          x={50}
          y={170}
          text={'Label'}
          background={new Sein.Color(0.6, 0.8, 0.4, 1.0)}
        />
      </Sein.GUI.Combine>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Texture', url: getStaticAssetUrl('/assets/paradise.jpg'), name: 'paradise.jpg', flipY: true});
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
      element: <Root />,
      baseWidth: 600
    });
  }
}