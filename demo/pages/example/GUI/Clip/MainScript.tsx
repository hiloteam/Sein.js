/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/23/2019, 3:28:21 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Clip extends Sein.GUI.Component<{}, {}> {
  public render() {
    const game = this.system.getGame();
  
    return (
      <Sein.GUI.Clip
        shape={new Sein.Vector2(240, 240)}
        background={new Sein.Color(1.0, 0.8, 0)}
        x={50}
        y={50}
        padding={new Sein.Vector4(10, 10, 10, 10)}
      >
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          x={20}
          y={50}
          rotation={Math.PI/4}
          background={new Sein.Color(1.0, 0.4, 0.4, 1.0)}
        >
          <Sein.GUI.Container
            shape={new Sein.Vector2(50, 50)}
            x={0}
            y={0}
            background={game.resource.get<'Texture'>('paradise.jpg')}
          />
        </Sein.GUI.Container>
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
          background={new Sein.Color(0.4, 0.6, 0.8)}
          x={150}
          y={50}
        />
        <Sein.GUI.Label
          shape={new Sein.Vector2(100, 40)}
          x={50}
          y={200}
          text={'Label'}
          background={new Sein.Color(0.6, 0.8, 0.4, 1.0)}
        />
      </Sein.GUI.Clip>
    );
  }
}

class Root extends Sein.GUI.Component<{}, {}> {
  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Clip />
        <Sein.GUI.Clip
          shape={new Sein.Vector2(200, 200)}
          x={400}
          y={50}
          padding={new Sein.Vector4(25, 25, 25, 25)}
        >
          <Sein.GUI.Container
            shape={new Sein.Vector2(250, 250)}
            background={game.resource.get<'Texture'>('paradise.jpg')}
          />
        </Sein.GUI.Clip>
      </React.Fragment>
      
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
      element: <Root />
    });
  }
}