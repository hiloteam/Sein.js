/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 9/23/2019, 7:17:04 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Root extends Sein.GUI.Component<{}, {}> {
  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.BitmapFont
          shape={new Sein.Vector2(160, 96)}
          text={'10'}
          fontLibrary={game.resource.get<'Atlas'>('pixel-font.json')}
          fontSize={72}
          align={'left'}
          spaceWidth={10}
          spaceHeight={10}
        />
        <Sein.GUI.BitmapFont
          shape={new Sein.Vector2(240, 96)}
          x={200}
          text={'54'}
          fontLibrary={game.resource.get<'Atlas'>('pixel-font.json')}
          fontSize={72}
          spaceWidth={10}
          spaceHeight={10}
        />
        <Sein.GUI.BitmapFont
          shape={new Sein.Vector2(240, 96)}
          x={game.bound.width - 240}
          text={'230'}
          fontLibrary={game.resource.get<'Atlas'>('pixel-font.json')}
          align={'right'}
          fontSize={72}
          spaceWidth={10}
          spaceHeight={10}
        />
        <Sein.GUI.BitmapFont
          shape={new Sein.Vector2(240, 192)}
          x={game.bound.width/2}
          y={game.bound.height/2}
          text={'012\n345'}
          fontLibrary={game.resource.get<'Atlas'>('pixel-font.json')}
          fontSize={72}
          spaceWidth={10}
          spaceHeight={10}
        />
      </React.Fragment>
      
      
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Atlas', name: 'pixel-font.json', url: '/assets/bitmapFont/pixel-font.json'});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game);

    // 在实际使用GUI系统的所有功能之前，先至少添加一个GUI系统
    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root/>,
    });
  }
}
