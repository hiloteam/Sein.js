/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/22/2019, 11:51:03 AM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Root extends Sein.GUI.Component<{}, {}> {
  public state = {
    backgroundColor: new Sein.Color(0.8, 1.0, 0.6, 1.0),
    text: 'Label-Click'
  };

  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Sein.GUI.Label
          id={'Label-Click'}
          shape={new Sein.Vector2(100, 40)}
          x={50}
          y={50}
          text={this.state.text}
          background={this.state.backgroundColor}
          onTouchEnd={this.handleClick}
        />
        <Sein.GUI.Label
          id={'Label-1'}
          shape={new Sein.Vector2(128, 128)}
          x={50}
          y={120}
          text={'Label-Image'}
          background={game.resource.get<'Texture'>('paradise.jpg')}
          fontSize={20}
          fontColor={new Sein.Color(0.8, 0.3, 0.4, 1.0)}
          fontWeight={'bold'}
        />
        <Sein.GUI.Label
          id={'Label-2'}
          shape={new Sein.Vector2(100, 100)}
          x={50}
          y={270}
          text={'Label-Atlas'}
          background={{atlas: game.resource.get<'Atlas'>('22.json'), frame: '01'}}
          fontColor={new Sein.Color(0.9, 0.9, 0.4, 1.0)}
        />
        <Sein.GUI.Label
          id={'Label-3'}
          shape={new Sein.Vector2(100, 40)}
          x={180}
          y={50}
          text={'Label-Color-Border'}
          background={new Sein.Color(0.9, 0.9, 0.5, 1.0)}
          border={5}
          fontSize={10}
        />
        <Sein.GUI.Button
          id={'Button-0'}
          shape={new Sein.Vector2(100, 50)}
          x={500}
          y={50}
          text={'Button-0'}
          background={new Sein.Color(0.44, 0.64, 0.85, 1.0)}
          border={10}
          borderColor={new Sein.Color(0.96, 0.54, 0.45, 1.0)}
        />
        <Sein.GUI.Button
          id={'Button-1'}
          shape={new Sein.Vector2(100, 50)}
          x={500}
          y={150}
          text={'Button-1'}
        />
        <Sein.GUI.Button
          id={'Button-2'}
          shape={new Sein.Vector2(100, 50)}
          x={500}
          y={250}
          text={'Button-2'}
          background={new Sein.Color(0.9, 0.3, 0.4, 1.0)}
          border={6}
        />
      </React.Fragment>
    );
  }

  handleClick = () => {
    if (this.state.text === 'Label-Click') {
      this.setState({backgroundColor: new Sein.Color(1.0, 0.8, 0.6, 1.0)});
      this.setState({text: 'Label-Color'});
    }
    else {
      this.setState({text: 'Label-Click'});
      this.setState({backgroundColor: new Sein.Color(0.8, 1.0, 0.6, 1.0)});
    }
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'Texture', url: '/assets/paradise.jpg', name: 'paradise.jpg', flipY: true});
    game.resource.load({type: 'Atlas', name: '22.json', url: '/assets/sprites/22.json'});
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